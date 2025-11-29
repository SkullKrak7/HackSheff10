import os
import base64
import google.generativeai as genai

_configured = False

def configure_gemini():
    global _configured
    if not _configured:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            _configured = True
    return _configured

async def generate_outfit_image(description: str) -> str:
    if not configure_gemini():
        return "demo_mode:Image generation requires Gemini API key"
    
    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        prompt = f"""Generate a professional fashion photograph showing: {description}
        
Requirements:
- Studio lighting with neutral background
- High quality, detailed clothing
- Fashion photography style
- 3:4 aspect ratio portrait orientation"""
        
        response = model.generate_content(
            prompt,
            generation_config={
                'temperature': 0.7,
                'response_modalities': ['image']
            }
        )
        
        # Extract image from response
        if response.candidates and len(response.candidates) > 0:
            for part in response.candidates[0].content.parts:
                if hasattr(part, 'inline_data') and part.inline_data:
                    return part.inline_data.data
        
        return "demo_mode:No image generated"
    except Exception as e:
        return f"demo_mode:Error: {str(e)}"
