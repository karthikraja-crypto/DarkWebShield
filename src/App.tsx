
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Simple auth context for demo purposes
export const AuthContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  user: null as { name: string; email: string; avatar?: string } | null
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  // Check login status on mount
  useEffect(() => {
    const loginState = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('user');
    
    if (loginState === 'true' && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function that will be used across the app
  const login = (userData: { name: string; email: string; avatar?: string }) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    // Dispatch an event so other components can react
    window.dispatchEvent(new Event('storage'));
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    // Dispatch an event so other components can react
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
                } />
                <Route path="/scan" element={
                  isLoggedIn ? <Scan /> : <Navigate to="/login" replace />
                } />
                <Route path="/results" element={
                  isLoggedIn ? <Results /> : <Navigate to="/login" replace />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/settings" element={
                  isLoggedIn ? <Settings /> : <Navigate to="/login" replace />
                } />
                <Route path="/about" element={<About />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
