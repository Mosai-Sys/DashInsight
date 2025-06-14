import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import useTenantStore from '../state/tenant';

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

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSchoolId(event.target.value);
  };

  if (loading || error) return null;

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel id="school-select-label">School</InputLabel>
      <Select
        labelId="school-select-label"
        value={selectedSchoolId || ''}
        label="School"
        onChange={handleChange}
      >
        {data.allSchools.map((school: { id: string; name: string }) => (
          <MenuItem key={school.id} value={school.id}>
            {school.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
