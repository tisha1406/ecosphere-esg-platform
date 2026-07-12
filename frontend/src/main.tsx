import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { QueryProvider } from './app/providers/QueryProvider'
import { AuthProvider } from './app/providers/AuthProvider'
import { ThemeProvider } from './app/providers/ThemeProvider'
import { Toaster } from './shared/components/ui/sonner'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
