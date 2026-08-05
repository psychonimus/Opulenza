import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './services/showUserInfo/ShowUserInfo'
import { BackdropProvider } from './components/CommonBackdrop/BackdropContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BackdropProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </BackdropProvider>
    </BrowserRouter>
  </StrictMode>,
)
