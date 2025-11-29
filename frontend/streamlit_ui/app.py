import streamlit as st
import requests
import os

st.set_page_config(page_title="RetailOdyssey", page_icon="👗", layout="wide")

API_URL = os.getenv("API_URL", "http://localhost:8000")

st.title("RetailOdyssey")
st.markdown("Multi-agent fashion assistant")

if "messages" not in st.session_state:
    st.session_state.messages = []

with st.sidebar:
    st.header("Challenges")
    st.markdown("""
    - Reply: Multi-agent chat
    - Frasers: Fashion retail
    - Grafana: Monitoring
    - Theme: Odyssey
    """)
    
    st.header("Active Agents")
    st.markdown("""
    - VisionAgent
    - RecommendationAgent
    - ConversationAgent
    """)
    
    if st.button("Clear Chat"):
        st.session_state.messages = []
        st.rerun()

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(f"**{msg.get('agent', msg['role'])}**: {msg['content']}")

if prompt := st.chat_input("Ask about outfit recommendations..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    try:
        response = requests.post(
            f"{API_URL}/api/chat",
            json={"message": prompt},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            for agent_response in data.get("responses", []):
                agent_msg = {
                    "role": "assistant",
                    "agent": agent_response["agent"],
                    "content": agent_response["message"]
                }
                st.session_state.messages.append(agent_msg)
                
                with st.chat_message("assistant"):
                    st.markdown(f"**{agent_response['agent']}**: {agent_response['message']}")
        else:
            st.error(f"API Error: {response.status_code}")
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        st.info("Make sure API is running: python -m src.api.main")

st.divider()
col1, col2 = st.columns([2, 1])

with col1:
    uploaded_file = st.file_uploader("Upload wardrobe image", type=["jpg", "jpeg", "png"])
    if uploaded_file and st.button("Analyze Wardrobe"):
        st.info("Image analysis with VisionAgent")

with col2:
    st.metric("Messages", len(st.session_state.messages))
    st.metric("Active Agents", "3")
