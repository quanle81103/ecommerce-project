globalThis.global = globalThis;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from '../context/CartContext.jsx';
import { ChatProvider } from '../context/ChatContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
