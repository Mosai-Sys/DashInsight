import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';

const ALL_SCHOOLS = gql`
  query AllSchools {
    allSchools {
      id
      name
    }
  }
`;

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function MultiSchoolSelector({ selectedIds, onChange }: Props) {
  const { data, loading, error } = useQuery(ALL_SCHOOLS);

  if (loading || error) return null;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    if (value.length <= 4) {
      onChange(value);
    }
  };

  const getName = (id: string) =>
    data.allSchools.find((s: { id: string }) => s.id === id)?.name || id;

  return (
    <FormControl sx={{ minWidth: 240 }} size="small">
      <InputLabel id="multi-school-label">Schools</InputLabel>
      <Select
        multiple
        label="Schools"
        labelId="multi-school-label"
        value={selectedIds}
        onChange={handleChange}
        renderValue={(selected) => selected.map(getName).join(', ')}
      >
        {data.allSchools.map((school: { id: string; name: string }) => (
          <MenuItem key={school.id} value={school.id}>
            <Checkbox checked={selectedIds.indexOf(school.id) > -1} />
            <ListItemText primary={school.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
