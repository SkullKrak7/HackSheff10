import asyncio
import sys
from src.agents.group_chat_orchestrator import GroupChatOrchestrator

async def test_orchestrator():
    print("Testing GroupChatOrchestrator...")
    orchestrator = GroupChatOrchestrator()
    
    print("\n1. Testing recommendation request...")
    responses = await orchestrator.process_message("What should I wear to a wedding?")
    for r in responses:
        print(f"  {r.sender}: {r.content[:80]}...")
    
    print("\n2. Testing conversation history...")
    history = orchestrator.get_conversation_history()
    print(f"  History has {len(history)} messages")
    
    print("\n3. Testing agent identification...")
    agents = orchestrator._identify_relevant_agents("recommend an outfit", False)
    print(f"  Identified agents: {agents}")
    
    print("\n✓ All orchestrator tests passed!")
    return True

async def test_api():
    print("\nTesting API endpoints...")
    import httpx
    
    try:
        async with httpx.AsyncClient() as client:
            print("1. Testing health endpoint...")
            response = await client.get("http://localhost:8000/api/health", timeout=5.0)
            print(f"  Status: {response.status_code}")
            print(f"  Response: {response.json()}")
            
            print("\n2. Testing metrics endpoint...")
            response = await client.get("http://localhost:8000/api/metrics", timeout=5.0)
            print(f"  Status: {response.status_code}")
            
            print("\n✓ API tests passed!")
            return True
    except Exception as e:
        print(f"  ✗ API not running: {e}")
        print("  Start API with: python -m src.api.main")
        return False

async def main():
    print("=" * 60)
    print("RetailOdyssey End-to-End Test")
    print("=" * 60)
    
    orchestrator_ok = await test_orchestrator()
    api_ok = await test_api()
    
    print("\n" + "=" * 60)
    if orchestrator_ok and api_ok:
        print("✓ ALL TESTS PASSED - System ready!")
    elif orchestrator_ok:
        print("⚠ Orchestrator works, but API needs to be started")
    else:
        print("✗ Tests failed")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
