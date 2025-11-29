import os
import base64
import io
from google import genai
from google.genai import types

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            _client = genai.Client(api_key=api_key)
    return _client

async def generate_outfit_image(description: str) -> str:
    client = get_client()
    
    if not client:
        return "demo_mode:Image generation requires Gemini API key"
    
    try:
        prompt = f"Professional fashion photography: {description}. Studio lighting, neutral background, high quality, detailed clothing."
        
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=['IMAGE'],
                image_config=types.ImageConfig(
                    aspect_ratio="3:4",
                    image_size="2K"
                )
            )
        )
        
        for part in response.parts:
            if image := part.as_image():
                buffered = io.BytesIO()
                image.save(buffered, format="JPEG")
                img_base64 = base64.b64encode(buffered.getvalue()).decode()
                return img_base64
        
        return "demo_mode:No image generated"
    except Exception as e:
        return f"demo_mode:Error: {str(e)}"
