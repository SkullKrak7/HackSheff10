import pytest
from src.agents.group_chat_orchestrator import GroupChatOrchestrator

def test_orchestrator_init():
    orchestrator = GroupChatOrchestrator()
    assert orchestrator.messages == []
    assert orchestrator.wardrobe_context == ""

def test_identify_agents():
    orchestrator = GroupChatOrchestrator()
    agents = orchestrator._identify_relevant_agents("recommend an outfit", False)
    assert "RecommendationAgent" in agents
