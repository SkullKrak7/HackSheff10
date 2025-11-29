import os
from openai import AsyncOpenAI

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            _client = AsyncOpenAI(api_key=api_key)
    return _client

async def generate_response(conversation_history: list, user_message: str) -> str:
    client = get_client()
    
    if not client:
        return "I'm here to help with fashion advice! Ask me anything about outfits, style, or trends. (demo mode)"
    
    try:
        messages = [
            {
                "role": "system",
                "content": "You are a friendly fashion assistant in a multi-agent chat. Help users with outfit advice, style tips, and fashion recommendations. Be conversational, helpful, and build on what other agents say."
            }
        ]
        
        # Add conversation history
        for msg in conversation_history[-10:]:
            role = "assistant" if msg["role"] != "User" else "user"
            messages.append({"role": role, "content": msg["content"]})
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"I'm here to help with fashion! (error: {str(e)[:50]})"
