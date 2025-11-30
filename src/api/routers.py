from fastapi import APIRouter, Response
from ..utils.prometheus_metrics import export_metrics

router = APIRouter()

@router.get("/metrics")
async def get_prometheus_metrics():
    return Response(content=export_metrics(), media_type="text/plain")

