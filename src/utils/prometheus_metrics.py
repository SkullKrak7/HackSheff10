from prometheus_client import Counter, Histogram, Gauge, generate_latest
from .metrics import metrics

agent_calls = Counter('retail_odyssey_agent_calls', 'Agent call count', ['agent_name'])
total_requests = Counter('retail_odyssey_total_requests', 'Total requests')
response_time = Histogram('retail_odyssey_response_time', 'Response time in seconds')
active_conversations = Gauge('retail_odyssey_active_conversations', 'Active conversations')

def export_metrics():
    data = metrics.get_metrics()
    
    for agent, count in data.get('agent_calls', {}).items():
        agent_calls.labels(agent_name=agent).inc(count)
    
    total_requests.inc(data.get('total_requests', 0))
    
    return generate_latest()
