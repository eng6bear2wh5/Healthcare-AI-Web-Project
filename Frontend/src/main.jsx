import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CategoryProvider } from './contexts/CategoryContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Ở đây bọc toàn bộ App bằng context provider */}
    <CategoryProvider>
      <App />
    </CategoryProvider>
  </React.StrictMode>
)


