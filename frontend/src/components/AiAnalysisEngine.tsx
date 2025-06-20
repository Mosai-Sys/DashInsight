import React, { useEffect, useState } from 'react';
import { pipeline, env } from '@xenova/transformers';
import { gql, useMutation } from '@apollo/client';
import useIndexedDB from '../hooks/useIndexedDB';
import { Snackbar, Alert } from '@mui/material';

env.allowLocalModels = true;
const model_id = 'Xenova/phi-3-mini-4k-instruct-onnx';

const GENERATE_REPORT = gql`
  mutation generateReport($html: String!) {
    generateReport(htmlContent: $html)
  }
`;

type ExportStatus = 'idle' | 'exporting' | 'ready';

export default function AiAnalysisEngine() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [generator, setGenerator] = useState<any>(null);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [savedOutput, saveOutput] = useIndexedDB<{ text: string; timestamp: number }>('last-report');
  const [restored, setRestored] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [inputPrompt, setInputPrompt] = useState(
    'You are an education advisor. Based on the following school data, write a short report in Norwegian:\n' +
      '- Absence rate: 12.4%\n- Budget deviation: -400,000 NOK\n- Student satisfaction score: 3.5\n\n' +
      'Keep it professional, under 200 words.'
  );

  const [generateReport] = useMutation(GENERATE_REPORT);

  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      const pipe = await pipeline('text-generation', model_id);
      setGenerator(() => pipe);
      setLoading(false);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (savedOutput && savedOutput.text) {
      setOutput(savedOutput.text);
      setRestored(true);
    }
  }, [savedOutput]);

  const handleGenerate = async () => {
    if (!generator) return;
    setLoading(true);
    const result = await generator(inputPrompt, { max_new_tokens: 256 });
    const text = result[0].generated_text as string;
    setOutput(text);
    await saveOutput({ text, timestamp: Date.now() });
    setSavedMsg(true);
    setLoading(false);
    setExportStatus('idle');
  };

  const handleExport = async () => {
    if (!output) return;
    setExportStatus('exporting');
    try {
      const htmlContent = `<html><body><pre>${output}</pre></body></html>`;
      const result = await generateReport({ variables: { html: htmlContent } });
      const pdfUrl = result.data?.generateReport;
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExportStatus('ready');
      } else {
        setExportStatus('idle');
      }
    } catch (err) {
      console.error('Export failed', err);
      setExportStatus('idle');
    }
  };

  return (
    <>
      <div
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: '2rem',
          borderRadius: '1rem',
        }}
      >
        <h2>AI-Generated Report</h2>
        <textarea
          style={{ width: '100%', height: '120px', padding: '1rem', marginBottom: '1rem' }}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <button
          style={{ marginLeft: '1rem' }}
          onClick={handleExport}
          disabled={!output || exportStatus === 'exporting'}
        >
          {exportStatus === 'exporting' ? 'Exporting...' : 'Export to PDF'}
        </button>
        {exportStatus === 'ready' && <span style={{ marginLeft: '0.5rem' }}>Download ready</span>}
        <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
          <strong>Output:</strong>
          <p>{output}</p>
        </div>
      </div>
      <Snackbar
        open={restored}
        autoHideDuration={3000}
        onClose={() => setRestored(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Restored last AI report
        </Alert>
      </Snackbar>
      <Snackbar
        open={savedMsg}
        autoHideDuration={3000}
        onClose={() => setSavedMsg(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Saved AI report
        </Alert>
      </Snackbar>
    </>
  );
}
