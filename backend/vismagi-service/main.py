from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()


@app.get("/health")
async def health():
    return {"status": "ok"}


class ColumnMeta(BaseModel):
    name: str
    type: str  # e.g. numeric, categorical, temporal, geo
    cardinality: Optional[int] = None
    data_type: Optional[str] = None


class DatasetMeta(BaseModel):
    columns: List[ColumnMeta]


class ChartConfig(BaseModel):
    type: str
    xAxis: Optional[str] = None
    yAxis: Optional[str] = None
    title: Optional[str] = None


@app.post("/recommend", response_model=List[ChartConfig])
async def recommend(meta: DatasetMeta) -> List[ChartConfig]:
    """Return chart recommendations based on simple heuristics."""
    columns = meta.columns
    numerics = [c for c in columns if c.type == "numeric"]
    categoricals = [c for c in columns if c.type == "categorical"]
    temporals = [c for c in columns if c.type in {"temporal", "datetime"}]
    geos = [c for c in columns if c.type == "geo"]

    charts: List[ChartConfig] = []

    if temporals and numerics:
        charts.append(
            ChartConfig(
                type="line",
                xAxis=temporals[0].name,
                yAxis=numerics[0].name,
                title=f"{numerics[0].name} over time",
            )
        )

    if categoricals and numerics:
        charts.append(
            ChartConfig(
                type="bar",
                xAxis=categoricals[0].name,
                yAxis=numerics[0].name,
                title=f"{numerics[0].name} by {categoricals[0].name}",
            )
        )

    if len(numerics) >= 2:
        charts.append(
            ChartConfig(
                type="scatter",
                xAxis=numerics[0].name,
                yAxis=numerics[1].name,
                title=f"{numerics[1].name} vs {numerics[0].name}",
            )
        )

    if geos and numerics:
        charts.append(
            ChartConfig(
                type="heatmap",
                xAxis=geos[0].name,
                yAxis=numerics[0].name,
                title=f"{numerics[0].name} by {geos[0].name}",
            )
        )

    if len(categoricals) > 2:
        charts.append(
            ChartConfig(
                type="treemap",
                xAxis=categoricals[0].name,
                yAxis=categoricals[1].name,
                title="Treemap of categories",
            )
        )

    return charts
