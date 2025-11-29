# Grafana Integration

## Quick Setup

### 1. Install Grafana
```bash
docker run -d -p 3000:3000 grafana/grafana
```

### 2. Access Grafana
- URL: http://localhost:3000
- Default login: admin/admin

### 3. Add Data Source
1. Go to Configuration > Data Sources
2. Add Prometheus
3. URL: http://localhost:8000/api/metrics
4. Save & Test

### 4. Import Dashboard
1. Go to Dashboards > Import
2. Upload `dashboard.json`
3. Select Prometheus data source

## Metrics Available

- `retail_odyssey_total_requests`: Total API requests
- `retail_odyssey_agent_calls`: Calls per agent
- `retail_odyssey_avg_response_time`: Average response time
- `retail_odyssey_active_conversations`: Active chat sessions

## Demo Mode

For hackathon demo, screenshots of dashboard are in `/grafana/screenshots/`
