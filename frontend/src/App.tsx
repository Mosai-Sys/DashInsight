import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import KPIGrid, { KPI } from './components/KPIGrid';
import ChartPanel, { ChartConfig } from './components/ChartPanel';
import AiAnalysisEngine from './components/AiAnalysisEngine';

const MY_SCHOOL = gql`
  query MySchool {
    mySchool {
      name
      kpis {
        name
        value
        trend
        unit
      }
      datasets {
        recommendedCharts {
          type
          title
          xAxis
          yAxis
        }
      }
    }
  }
`;

export default function App() {
  const { data, loading, error } = useQuery(MY_SCHOOL);
  const [showAI, setShowAI] = useState(false);

  if (loading) {
    return (
      <Container sx={{ p: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ p: 4 }}>
        <Typography color="error">Error loading data</Typography>
      </Container>
    );
  }

  const schoolName: string = data?.mySchool?.name ?? 'School';
  const kpis: KPI[] = data?.mySchool?.kpis ?? [];
  const charts: ChartConfig[] = data?.mySchool?.datasets?.recommendedCharts ?? [];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {schoolName} Dashboard
      </Typography>
      <KPIGrid kpis={kpis} />
      <ChartPanel charts={charts} />
      <Button variant="contained" sx={{ mt: 4 }} onClick={() => setShowAI(!showAI)}>
        {showAI ? 'Close AI Analysis' : 'Open AI Analysis'}
      </Button>
      {showAI && <AiAnalysisEngine />}
    </Container>
  );
}
