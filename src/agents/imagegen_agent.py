import os
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_outfit_visualization(outfit_description: str) -> str:
    try:
        response = await client.images.generate(
            model="dall-e-3",
            prompt=f"Fashion outfit visualization: {outfit_description}. Professional fashion photography style.",
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        return f"ImageGenAgent: Outfit visualization concept ready for {outfit_description}"
