import React from 'react';
import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './components/App';



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
      <App />
  );


