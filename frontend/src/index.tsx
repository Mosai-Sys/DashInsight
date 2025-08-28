import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import CompareView from './views/CompareView';
import OrbitalDashboardUI from './OrbitalDashboardUI';
import client from './apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { ThemeProvider } from './hooks/useTheme';
import './i18n';
import './index.css';

registerSW({ immediate: true });

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/compare" element={<CompareView />} />
              <Route path="/orbital" element={<OrbitalDashboardUI />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
}
