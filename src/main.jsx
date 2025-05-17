import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify';

// Initialize React application with Router and Redux store
ReactDOM.createRoot(document.getElementById('root')).render(
  // Add React strict mode for development checking
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
        />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)