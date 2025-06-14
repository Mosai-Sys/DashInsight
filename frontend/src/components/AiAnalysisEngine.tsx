from pathlib import Path

# Define the file path for AiAnalysisEngine.tsx
ai_engine_path = Path("/mnt/data/kommunalt-dashboard/frontend/src/components/AiAnalysisEngine.tsx")

# Define component code for AiAnalysisEngine.tsx
ai_engine_code = """
import React, { useEffect, useState } from 'react'
import { pipeline, env } from '@xenova/transformers'

env.allowLocalModels = false;

const model_id = 'Xenova/phi-3-mini-4k-instruct-onnx';

export default function AiAnalysisEngine() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [generator, setGenerator] = useState(null);
  const [inputPrompt, setInputPrompt] = useState(
    "You are an education advisor. Based on the following school data, write a short report in Norwegian:\\n" +
    "- Absence rate: 12.4%\\n- Budget deviation: -400,000 NOK\\n- Student satisfaction score: 3.5\\n\\n" +
    "Keep it professional, under 200 words."
  );

  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      const pipe = await pipeline('text-generation', model_id);
      setGenerator(() => pipe);
      setLoading(false);
    };
    loadModel();
  }, []);

  const handleGenerate = async () => {
    if (!generator) return;
    setLoading(true);
    const result = await generator(inputPrompt, { max_new_tokens: 256 });
    setOutput(result[0].generated_text);
    setLoading(false);
  };

  return (
    <div style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem' }}>
      <h2>AI-Generated Report</h2>
      <textarea
        style={{ width: '100%', height: '120px', padding: '1rem', marginBottom: '1rem' }}
        value={inputPrompt}
        onChange={(e) => setInputPrompt(e.target.value)}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
        <strong>Output:</strong>
        <p>{output}</p>
      </div>
    </div>
  );
}
"""

# Write the file
ai_engine_path.write_text(ai_engine_code.strip(), encoding="utf-8")
ai_engine_path.name
