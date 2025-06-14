import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';

export interface KPISchool {
  id: string;
  name: string;
  kpis: { name: string; value: number; unit?: string }[];
}

interface Props {
  schools: KPISchool[];
}

export default function KPIComparisonTable({ schools }: Props) {
  if (schools.length === 0) return null;
  const kpiNames = Array.from(
    new Set(schools.flatMap((s) => s.kpis.map((k) => k.name)))
  );

  const getValue = (school: KPISchool, name: string) => {
    const k = school.kpis.find((x) => x.name === name);
    return k ? `${k.value}${k.unit ? ` ${k.unit}` : ''}` : '-';
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3, overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>KPI</TableCell>
            {schools.map((s) => (
              <TableCell key={s.id}>{s.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {kpiNames.map((name) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              {schools.map((s) => (
                <TableCell key={s.id}>{getValue(s, name)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
