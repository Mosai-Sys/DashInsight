import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import KPIGrid, { KPI } from './components/KPIGrid';
import ChartPanel, { ChartConfig } from './components/ChartPanel';
import AiAnalysisEngine from './components/AiAnalysisEngine';
import SchoolSelector from './components/SchoolSelector';
import useTenantStore from './state/tenant';

const GET_SCHOOL = gql`
  query GetSchool($id: ID!) {
    school(id: $id) {
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
  const selectedSchoolId = useTenantStore((s) => s.selectedSchoolId);
  const { data, loading, error } = useQuery(GET_SCHOOL, {
    variables: { id: selectedSchoolId },
    skip: !selectedSchoolId,
  });
  const [showAI, setShowAI] = useState(false);

  const schoolName: string = data?.school?.name ?? '';
  const kpis: KPI[] = data?.school?.kpis ?? [];
  const charts: ChartConfig[] = data?.school?.datasets?.recommendedCharts ?? [];

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {schoolName ? `${schoolName} Dashboard` : 'Dashboard'}
        </Typography>
        <SchoolSelector />
      </Box>
      {!selectedSchoolId && <Typography>Select a school to view data.</Typography>}
      {selectedSchoolId && loading && (
        <CircularProgress />
      )}
      {error && (
        <Typography color="error">Error loading data</Typography>
      )}
      {data?.school && !loading && (
        <>
          <KPIGrid kpis={kpis} />
          <ChartPanel charts={charts} />
          <Button variant="contained" sx={{ mt: 4 }} onClick={() => setShowAI(!showAI)}>
            {showAI ? 'Close AI Analysis' : 'Open AI Analysis'}
          </Button>
          {showAI && <AiAnalysisEngine />}
        </>
      )}
    </Container>
  );
}
