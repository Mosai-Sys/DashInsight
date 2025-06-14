from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class ColumnMeta(BaseModel):
    name: str
    type: str  # expected values: numeric, categorical, datetime

class DatasetMeta(BaseModel):
    columns: List[ColumnMeta]

class Recommendation(BaseModel):
    charts: List[str]

def recommend_charts(meta: DatasetMeta) -> Recommendation:
    types = [col.type for col in meta.columns]
    charts = set()
    if types.count("numeric") >= 2:
        charts.add("scatter")
    if "categorical" in types and "numeric" in types:
        charts.add("bar")
    if "datetime" in types and "numeric" in types:
        charts.add("line")
    if not charts:
        charts.add("table")
    return Recommendation(charts=sorted(charts))

@app.post("/recommend", response_model=Recommendation)
async def get_recommendation(meta: DatasetMeta):
    return recommend_charts(meta)
