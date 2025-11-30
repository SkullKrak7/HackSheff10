import os
from dotenv import load_dotenv
import google.generativeai as genai
from openai import AsyncOpenAI

load_dotenv()

_gemini_configured = False
_openai_client = None

def configure_gemini():
    global _gemini_configured
    if not _gemini_configured:
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            _gemini_configured = True
    return _gemini_configured

def get_openai_client():
    global _openai_client
    if _openai_client is None:
        key = os.getenv("OPENAI_API_KEY")
        if key:
            _openai_client = AsyncOpenAI(api_key=key)
    return _openai_client

async def recommend_outfit(user_request: str, wardrobe_context: str = "") -> str:
    """
    Recommend outfit using Gemini with Google Search grounding for real products
    """
    if configure_gemini():
        try:
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY"))
            
            grounding_tool = types.Tool(
                google_search=types.GoogleSearch()
            )
            
            config = types.GenerateContentConfig(
                tools=[grounding_tool],
                temperature=0.7,
                top_p=0.95,
                max_output_tokens=512,
            )
            
            prompt = f"""Search for REAL products on Frasers Group websites and recommend them:

Sites to search:
- sportsdirect.com (activewear, casual)
- houseoffraser.co.uk (premium fashion)
- flannels.com (designer brands)
- usc.co.uk (streetwear)
- jackwills.com (British style)

User: {user_request}
Wardrobe: {wardrobe_context if wardrobe_context else "None"}

Find 2-3 real products with prices and brands. Be specific."""
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=config,
            )
            
            text = response.text
            
            # Add inline citations from grounding metadata
            if response.candidates and response.candidates[0].grounding_metadata:
                metadata = response.candidates[0].grounding_metadata
                
                if hasattr(metadata, 'grounding_supports') and metadata.grounding_supports:
                    chunks = metadata.grounding_chunks if hasattr(metadata, 'grounding_chunks') else []
                    
                    # Sort by end_index descending to avoid shifting
                    sorted_supports = sorted(
                        metadata.grounding_supports,
                        key=lambda s: s.segment.end_index,
                        reverse=True
                    )
                    
                    for support in sorted_supports:
                        end_index = support.segment.end_index
                        if support.grounding_chunk_indices:
                            citation_links = []
                            for i in support.grounding_chunk_indices:
                                if i < len(chunks) and hasattr(chunks[i], 'web'):
                                    uri = chunks[i].web.uri
                                    citation_links.append(f"[🔗]({uri})")
                            
                            if citation_links:
                                citation_string = " " + " ".join(citation_links)
                                text = text[:end_index] + citation_string + text[end_index:]
            
            return text
            
        except Exception as e:
            print(f"Gemini recommendation error: {e}")
    
    # Fallback to OpenAI
    client = get_openai_client()
    if client:
        try:
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{
                    "role": "system",
                    "content": "You are a fashion stylist. Suggest outfits based on occasion, weather, and available wardrobe."
                }, {
                    "role": "user",
                    "content": f"Request: {user_request}\nWardrobe: {wardrobe_context}\nSuggest an outfit."
                }]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI recommendation error: {e}")
    
    return "RecommendationAgent: Try pairing a blazer with dark jeans and boots (no API key configured)"
