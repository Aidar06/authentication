import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { BrowserRouter } from 'react-router-dom';

// Находим корневой элемент
const rootElement = document.getElementById('root');

// Создаём root и рендерим
createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);

