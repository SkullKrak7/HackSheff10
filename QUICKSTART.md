# Quick Start Guide

## Setup (5 minutes)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Run tests
python test_e2e.py
```

## Running the App

### Terminal 1: Start API
```bash
python -m src.api.main
```

### Terminal 2: Start UI
```bash
streamlit run frontend/streamlit_ui/app.py
```

### Terminal 3: Test
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What should I wear to a wedding?"}'
```

## Access

- **Streamlit UI**: http://localhost:8501
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health
- **Metrics**: http://localhost:8000/api/metrics

## Demo Mode

The app works without OpenAI key (demo responses). Add key for real AI responses.

## Testing

```bash
pytest tests/
python test_e2e.py
```
