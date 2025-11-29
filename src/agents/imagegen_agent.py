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
        prompt = f"""Professional fashion photography of a mannequin wearing: {description}

CRITICAL REQUIREMENTS:
- MUST show a full-body mannequin (not a person)
- Mannequin should be white/neutral colored
- Studio lighting with clean white or light gray background
- High quality, detailed clothing visible
- Fashion retail display style"""
        
        response = client.models.generate_images(
            model='imagen-3.0-generate-001',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio='3:4',
                safety_filter_level='block_some',
                person_generation='allow_adult'
            )
        )
        
        if response.generated_images and len(response.generated_images) > 0:
            image = response.generated_images[0].image
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            return img_base64
        
        return "demo_mode:No image generated"
    except Exception as e:
        return f"demo_mode:Error: {str(e)}"
