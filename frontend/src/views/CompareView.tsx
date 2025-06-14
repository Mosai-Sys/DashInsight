import React, { useState, useEffect, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Link as MuiLink,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MultiSchoolSelector from '../components/MultiSchoolSelector';
import KPIComparisonTable from '../components/KPIComparisonTable';
import { KPISchool } from '../components/KPIComparisonTable';
import useLocalStorage from '../hooks/useLocalStorage';

const COMPARE_SCHOOLS = gql`
  query CompareSchools($ids: [ID!]!) {
    compareSchools(ids: $ids) {
      id
      name
      kpis {
        name
        value
        unit
      }
    }
  }
`;

export default function CompareView() {
  const [selectedIds, setSelectedIds] = useLocalStorage<string[]>('compareSchools', []);
  const [restored, setRestored] = useState(false);
  const [saved, setSaved] = useState(false);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      if (selectedIds.length > 0) setRestored(true);
    } else {
      setSaved(true);
    }
  }, [selectedIds]);

  const { data, loading, error } = useQuery(COMPARE_SCHOOLS, {
    variables: { ids: selectedIds },
    skip: selectedIds.length < 2,
  });

  const schools: KPISchool[] = data?.compareSchools ?? [];

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Compare Schools</Typography>
        <MuiLink component={Link} to="/" underline="hover">
          Back to Dashboard
        </MuiLink>
      </Box>
      <MultiSchoolSelector selectedIds={selectedIds} onChange={setSelectedIds} />
      {selectedIds.length < 2 && (
        <Typography sx={{ mt: 2 }}>Select 2–4 schools to compare.</Typography>
      )}
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error loading comparison
        </Typography>
      )}
      {schools.length > 0 && !loading && (
        <KPIComparisonTable schools={schools} />
      )}
      <Snackbar
        open={restored}
        autoHideDuration={3000}
        onClose={() => setRestored(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Restored compare selection
        </Alert>
      </Snackbar>
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Saved compare selection
        </Alert>
      </Snackbar>
    </Container>
  );
}
