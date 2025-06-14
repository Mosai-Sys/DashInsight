import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Box, Tabs, Tab } from '@mui/material';

export interface ChartConfig {
  type: string;
  title: string;
  xAxis: string[];
  yAxis: number[];
}

interface Props {
  charts: ChartConfig[];
}

export default function ChartPanel({ charts }: Props) {
  const [index, setIndex] = useState(0);
  const handleChange = (_: any, value: number) => setIndex(value);
  if (charts.length === 0) return null;
  const current = charts[index];
  const options: Highcharts.Options = {
    chart: { type: current.type as any },
    title: { text: current.title },
    xAxis: { categories: current.xAxis },
    series: [{ data: current.yAxis, type: current.type as any }],
  };
  return (
    <Box sx={{ mt: 3 }}>
      {charts.length > 1 && (
        <Tabs value={index} onChange={handleChange}>
          {charts.map((c, i) => (
            <Tab key={i} label={c.title} />
          ))}
        </Tabs>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
}
