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
import './index.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

registerSW({ immediate: true });

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/compare" element={<CompareView />} />
                <Route path="/orbital" element={<OrbitalDashboardUI />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </I18nextProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
}
