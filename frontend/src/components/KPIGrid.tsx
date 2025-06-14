import React from 'react';
import { Grid, Card, Typography } from '@mui/material';

export interface KPI {
  name: string;
  value: number;
  trend: number;
  unit?: string;
}

interface Props {
  kpis: KPI[];
}

export default function KPIGrid({ kpis }: Props) {
  return (
    <Grid container spacing={2}>
      {kpis.map((kpi) => (
        <Grid item xs={12} sm={6} md={3} key={kpi.name}>
          <Card
            sx={{
              p: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6">{kpi.name}</Typography>
            <Typography variant="h4">
              {kpi.value}
              {kpi.unit ? ` ${kpi.unit}` : ''}
            </Typography>
            <Typography color={kpi.trend >= 0 ? 'success.main' : 'error.main'}>
              {kpi.trend >= 0 ? '▲' : '▼'} {Math.abs(kpi.trend)}%
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
