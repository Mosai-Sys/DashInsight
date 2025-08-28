import React, { useEffect, useState, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Snackbar,
  Alert,
} from '@mui/material';
import useTenantStore from '../state/tenant';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';

const ALL_SCHOOLS = gql`
  query AllSchools {
    allSchools {
      id
      name
    }
  }
`;

export default function SchoolSelector() {
  const { data, loading, error } = useQuery(ALL_SCHOOLS);
  const selectedSchoolId = useTenantStore((s) => s.selectedSchoolId);
  const setSchoolId = useTenantStore((s) => s.setSchoolId);
  const [storedId, setStoredId] = useLocalStorage<string | null>('selectedSchoolId', null);
  const [restored, setRestored] = useState(false);
  const [saved, setSaved] = useState(false);
  const initial = useRef(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (!selectedSchoolId && storedId) {
      setSchoolId(storedId);
      setRestored(true);
    }
  }, [storedId, selectedSchoolId, setSchoolId]);

  useEffect(() => {
    if (selectedSchoolId) {
      if (!initial.current) {
        setSaved(true);
      } else {
        initial.current = false;
      }
      setStoredId(selectedSchoolId);
    }
  }, [selectedSchoolId, setStoredId]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSchoolId(event.target.value);
  };

  if (loading || error) return null;

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="school-select-label">{t('schoolSelector.label')}</InputLabel>
        <Select
          labelId="school-select-label"
          value={selectedSchoolId || ''}
          label={t('schoolSelector.label')}
          onChange={handleChange}
        >
          {data.allSchools.map((school: { id: string; name: string }) => (
            <MenuItem key={school.id} value={school.id}>
              {school.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Snackbar
        open={restored}
        autoHideDuration={3000}
        onClose={() => setRestored(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          {t('schoolSelector.restored')}
        </Alert>
      </Snackbar>
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('schoolSelector.saved')}
        </Alert>
      </Snackbar>
    </>
  );
}
