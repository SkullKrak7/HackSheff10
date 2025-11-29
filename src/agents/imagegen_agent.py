import os
import base64
import io
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
        model = genai.GenerativeModel('imagen-3.0-generate-001')
        prompt = f"Professional fashion photography: {description}. Studio lighting, neutral background, high quality."
        
        response = model.generate_images(
            prompt=prompt,
            number_of_images=1,
            aspect_ratio="3:4"
        )
        
        if response.images:
            img = response.images[0]._pil_image
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            return img_base64
        return "demo_mode:No image generated"
    except Exception as e:
        return f"demo_mode:Error: {str(e)}"
