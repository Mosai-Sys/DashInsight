import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import CompareView from './views/CompareView';
import client from './apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/compare" element={<CompareView />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    </React.StrictMode>
  );
}
