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

### Prerequisites
- Python 3.11+
- Docker (optional, for containerized deployment)
- OpenAI API key

### Option 1: Docker (Recommended)
```bash
# 1. Clone repository
git clone https://github.com/SkullKrak7/HackSheff10.git
cd HackSheff10

# 2. Set up environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Start all services
docker-compose up -d

# 4. Access applications
# - Streamlit UI: http://localhost:8501
# - API Docs: http://localhost:8000/docs
# - Grafana: http://localhost:3000
```

### Option 2: Local Development
```bash
# 1. Clone repository
git clone https://github.com/SkullKrak7/HackSheff10.git
cd HackSheff10

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 4. Start API (Terminal 1)
python -m src.api.main

# 5. Start UI (Terminal 2)
streamlit run frontend/streamlit_ui/app.py

# 6. Access
# - Streamlit UI: http://localhost:8501
# - API Docs: http://localhost:8000/docs
```

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
