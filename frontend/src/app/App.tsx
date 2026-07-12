import React, { useState } from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./providers/AuthProvider"
import { useTheme } from "./providers/ThemeProvider"
import { 
  Leaf, 
  LayoutDashboard, 
  Globe, 
  Users, 
  ShieldCheck, 
  Trophy, 
  Settings, 
  LogOut, 
  Menu,
  Moon,
  Sun,
  Search,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  FileText
} from "lucide-react"
import { Button } from "../shared/components/ui/button"
import { Input } from "../shared/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "../shared/components/ui/avatar"
import { cn } from "../shared/lib/utils"
import { NotificationBell } from "../features/dashboard/components/NotificationBell"

function App() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="w-5 h-5 shrink-0" />, colorClass: "text-primary group-hover:text-primary", activeBg: "bg-primary/15 text-primary" },
    { name: "Environmental", path: "/environmental", icon: <Globe className="w-5 h-5 shrink-0" />, colorClass: "text-environmental group-hover:text-environmental", activeBg: "bg-environmental/15 text-environmental" },
    { name: "Social", path: "/social", icon: <Users className="w-5 h-5 shrink-0" />, colorClass: "text-social group-hover:text-social", activeBg: "bg-social/15 text-social" },
    { name: "Governance", path: "/governance", icon: <ShieldCheck className="w-5 h-5 shrink-0" />, colorClass: "text-governance group-hover:text-governance", activeBg: "bg-governance/15 text-governance" },
    { name: "Gamification", path: "/gamification", icon: <Trophy className="w-5 h-5 shrink-0" />, colorClass: "text-gamification group-hover:text-gamification", activeBg: "bg-gamification/15 text-gamification" },
    { name: "Reports", path: "/reports", icon: <FileText className="w-5 h-5 shrink-0" />, colorClass: "text-blue-500 group-hover:text-blue-500", activeBg: "bg-blue-500/15 text-blue-500" },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5 shrink-0" />, colorClass: "text-muted-foreground group-hover:text-foreground", activeBg: "bg-muted text-foreground" },
  ]

  const pathnames = location.pathname.split("/").filter((x) => x)
  
  const SidebarContent = () => (
    <>
      <div className={cn("flex h-16 shrink-0 items-center border-b border-border transition-all duration-300", sidebarCollapsed ? "justify-center px-2" : "px-6")}>
        <Leaf className="h-6 w-6 text-environmental shrink-0" />
        {!sidebarCollapsed && <span className="font-bold text-xl tracking-tight ml-2 truncate">EcoSphere</span>}
      </div>
      <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            title={sidebarCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg py-2.5 transition-all duration-200 group relative",
                sidebarCollapsed ? "justify-center px-2" : "px-3 gap-3",
                isActive
                  ? item.activeBg + " font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-current rounded-r-md" />
                )}
                <div className={cn(isActive ? "" : item.colorClass)}>
                  {item.icon}
                </div>
                {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden md:flex p-4 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("w-full text-muted-foreground hover:text-foreground", sidebarCollapsed ? "justify-center" : "justify-start")}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <><PanelLeftClose className="h-5 w-5 mr-2" /> Collapse Sidebar</>}
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-col bg-card border-r border-border transition-all duration-300 md:static md:flex md:translate-x-0 shadow-sm",
          sidebarOpen ? "flex translate-x-0 w-64" : "-translate-x-full",
          !sidebarOpen && sidebarCollapsed ? "md:w-20" : "md:w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-md px-4 md:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center text-sm text-muted-foreground font-medium capitalize">
              <span className="hover:text-foreground cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
              {pathnames.length > 0 && pathnames.map((name, index) => {
                const isLast = index === pathnames.length - 1
                return (
                  <React.Fragment key={name}>
                    <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
                    <span className={isLast ? "text-foreground" : "hover:text-foreground cursor-pointer transition-colors"}>
                      {name}
                    </span>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Global Search */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search..."
                className="w-64 pl-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 transition-all rounded-full h-9"
              />
            </div>
            
            <div className="flex items-center gap-1">
              <NotificationBell />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            <div className="h-6 w-px bg-border mx-1 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1 hover:bg-muted/80 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-9 w-9 border border-border/50">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user?.full_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Role: {user?.role.replace("_", " ")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/10">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
