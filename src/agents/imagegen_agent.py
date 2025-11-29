import os
import base64
import io
from google import genai
from google.genai.types import GenerateImagesConfig

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
        prompt = f"Professional fashion photography of a mannequin wearing: {description}. Studio lighting, neutral background, fashion retail display style."
        
        response = client.models.generate_images(
            model='imagen-3.0-generate-001',
            prompt=prompt,
            config=GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio='3:4'
            )
        )
        
        if response.generated_images:
            image = response.generated_images[0].image
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG")
            return base64.b64encode(buffered.getvalue()).decode()
        
        return "demo_mode:No image generated"
    except Exception as e:
        return f"demo_mode:Error: {str(e)}"
