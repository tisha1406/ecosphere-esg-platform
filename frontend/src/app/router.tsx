import React from "react"
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./providers/AuthProvider"
import App from "./App"

// Auth Pages
import { Login } from "../features/auth/Login"
import { Register } from "../features/auth/Register"
import { ForgotPassword } from "../features/auth/ForgotPassword"
import { EnvironmentalPage } from "../features/environmental/pages/EnvironmentalPage"
import { GovernancePage } from "../features/governance/pages/GovernancePage"
import { SocialPage } from "../features/social/pages/SocialPage"
import { GamificationPage } from "../features/gamification/pages/GamificationPage"
import { ReportsPage } from "../features/reports/pages/ReportsPage"
import { DashboardPage } from "../features/dashboard/pages/DashboardPage"
import { NotificationsPage } from "../features/dashboard/pages/NotificationsPage"

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "environmental",
        element: <EnvironmentalPage />,
      },
      {
        path: "social",
        element: <SocialPage />,
      },
      {
        path: "governance",
        element: <GovernancePage />,
      },
      {
        path: "gamification",
        element: <GamificationPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
