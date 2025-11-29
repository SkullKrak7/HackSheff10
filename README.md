# RetailOdyssey

Multi-agent fashion recommendation system for HackSheffield10.

## Challenge Alignment

### Reply AI Agents Challenge
- Multi-agent group conversation with 5 specialized agents
- Agents collaborate and reference each other's insights
- Targeted intent recognition routes queries to relevant agents
- Context management across conversation history
- Asynchronous agent coordination

### Frasers Group Challenge
- Next-gen retail engagement through AI fashion assistance
- Personalized outfit recommendations
- Wardrobe image analysis with GPT-4 Vision
- Interactive chat interface for modern consumers

### Grafana Challenge
- Real-time metrics collection and monitoring
- Prometheus metrics exporter
- Pre-configured Grafana dashboard
- Agent performance tracking

### Theme: Odyssey
- Fashion journey metaphor guiding users through style discovery
- Multi-agent collaboration represents exploration and discovery
- RetailOdyssey brand identity

## Features

- Multi-agent AI collaboration
- Fashion outfit recommendations
- Wardrobe image analysis
- Group chat interface
- Real-time metrics and monitoring

## Architecture

### AI Agents
- VisionAgent: Analyzes wardrobe images using GPT-4 Vision
- RecommendationAgent: Suggests outfits based on context
- IntentAgent: Parses user requests
- ConversationAgent: Manages dialogue flow
- ImageGenAgent: Generates outfit visualizations
- GroupChatOrchestrator: Coordinates multi-agent collaboration

### Tech Stack
- Backend: FastAPI (Python 3.11+)
- Frontend: Streamlit
- AI: OpenAI GPT-4o-mini
- Monitoring: Grafana + Prometheus
- Deployment: Docker + Docker Compose
- License: MIT

## Quick Start

### Option 1: Docker (Recommended)
```bash
# Set up environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Start all services
docker-compose up -d

# Access
# - Streamlit UI: http://localhost:8501
# - API: http://localhost:8000
# - Grafana: http://localhost:3000
```

### Option 2: Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Terminal 1: Start API
python -m src.api.main

# Terminal 2: Start UI
streamlit run frontend/streamlit_ui/app.py
```

Access at http://localhost:8501

## Testing

```bash
pytest tests/
python test_e2e.py
```

## Grafana Setup

See `grafana/README.md` for monitoring setup.

## Demo

Sample wardrobe images available in `datasets/sample_images.md`

## License

MIT
