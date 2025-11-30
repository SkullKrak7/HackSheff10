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
    Recommend outfit using Gemini with Frasers Group focus
    """
    if configure_gemini():
        try:
            model = genai.GenerativeModel("gemini-2.0-flash-exp")
            
            prompt = f"""You're a fashion stylist for Frasers Group. Recommend outfits and tell users which Frasers brand to shop at:

**Frasers Group Brands:**
- **Sports Direct** (sportswear, activewear, casual) - sportsdirect.com
- **House of Fraser** (premium fashion, formal wear) - houseoffraser.co.uk  
- **Flannels** (luxury designer brands) - flannels.com
- **USC** (streetwear, youth fashion) - usc.co.uk
- **Jack Wills** (British heritage, preppy style) - jackwills.com

**User Request:** {user_request}
**Available Wardrobe:** {wardrobe_context if wardrobe_context else "None"}

**Your Response Must Include:**
1. 2-3 outfit items
2. Which Frasers brand to buy each item from (be specific!)
3. Why it works

Keep under 150 words. Always mention at least 2 Frasers brands."""
            
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "max_output_tokens": 512,
                }
            )
            return response.text
            
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
