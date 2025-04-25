
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import CartPage from "./pages/Cart";
import FoldersPage from "./pages/Folders";
import QuotesPage from "./pages/Quotes";
import ClientsPage from "./pages/Clients";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.CLIENT, UserRole.AGENT]}>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/folders" 
              element={
                <ProtectedRoute>
                  <FoldersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quotes" 
              element={
                <ProtectedRoute>
                  <QuotesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.AGENT, UserRole.ADMIN]}>
                  <ClientsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
