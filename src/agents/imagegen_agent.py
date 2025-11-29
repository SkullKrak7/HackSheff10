import os
import base64
import io
import google.generativeai as genai

_configured = False

def configure_genai():
    global _configured
    if not _configured:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            _configured = True
    return _configured

async def generate_outfit_image(description: str) -> str:
    if not configure_genai():
        return ""
    
    try:
        prompt = f"Professional fashion photography of a mannequin wearing: {description}. Studio lighting, neutral background."
        
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        response = model.generate_content(prompt)
        
        for part in response.parts:
            if hasattr(part, 'inline_data') and part.inline_data:
                image = part.as_image()
                buffered = io.BytesIO()
                image.save(buffered, format="JPEG")
                return base64.b64encode(buffered.getvalue()).decode()
        
        return ""
    except Exception as e:
        print(f"Image generation error: {e}")
        return ""
