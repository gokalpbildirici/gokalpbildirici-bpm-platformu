import React from 'react';
import ReactDOM from 'react-dom/client';
import { Theme } from '@carbon/react';
import App from './App';
import './index.css';
import '@carbon/styles/css/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>
);
