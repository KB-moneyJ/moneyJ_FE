import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import RQProvider from '@/api/core/QueryClientProvider';
import '../index.css';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RQProvider>
    <App />
  </RQProvider>
);

