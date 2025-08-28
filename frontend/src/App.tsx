import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Container, Typography, Button, CircularProgress, Box, Link as MuiLink, Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const [loadedMsg, setLoadedMsg] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (data?.school) {
      setLoadedMsg(true);
    }
  }, [data]);

  const schoolName: string = data?.school?.name ?? '';
  const kpis: KPI[] = data?.school?.kpis ?? [];
  const charts: ChartConfig[] = data?.school?.datasets?.recommendedCharts ?? [];

  return (
    <>
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {schoolName ? t('dashboard.title', { schoolName }) : t('dashboard.dashboard')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MuiLink component={Link} to="/compare" underline="hover">
              {t('dashboard.compareLink')}
            </MuiLink>
            <SchoolSelector />
          </Box>
        </Box>
        {!selectedSchoolId && <Typography>{t('dashboard.selectPrompt')}</Typography>}
        {selectedSchoolId && loading && (
          <CircularProgress />
        )}
        {error && (
          <Typography color="error">{t('dashboard.errorLoading')}</Typography>
        )}
        {data?.school && !loading && (
          <>
            <KPIGrid kpis={kpis} />
            <ChartPanel charts={charts} />
            <Button variant="contained" sx={{ mt: 4 }} onClick={() => setShowAI(!showAI)}>
              {showAI ? t('dashboard.closeAI') : t('dashboard.openAI')}
            </Button>
            {showAI && <AiAnalysisEngine />}
          </>
        )}
      </Container>
      <Snackbar
        open={loadedMsg}
        autoHideDuration={3000}
        onClose={() => setLoadedMsg(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {schoolName ? t('dashboard.loaded', { schoolName }) : t('dashboard.dataLoaded')}
        </Alert>
      </Snackbar>
    </>
  );
}
