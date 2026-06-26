import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar   from './components/layout/Sidebar';
import TopBar    from './components/layout/TopBar';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reservations  from './pages/Reservations';
import InventoryGrid from './pages/InventoryGrid';
import RateManager   from './pages/RateManager';
import Channels  from './pages/Channels';
import { Promotions, Reports, SettingsPage } from './pages/StubPages';
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main>{children}</main>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', paddingTop:100 }}><div className="spinner" style={{ width:32, height:32 }} /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/"            element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
      <Route path="/reservations"element={<RequireAuth><AppLayout><Reservations /></AppLayout></RequireAuth>} />
      <Route path="/inventory"   element={<RequireAuth><AppLayout><InventoryGrid /></AppLayout></RequireAuth>} />
      <Route path="/rates"       element={<RequireAuth><AppLayout><RateManager /></AppLayout></RequireAuth>} />
      <Route path="/promotions"  element={<RequireAuth><AppLayout><Promotions /></AppLayout></RequireAuth>} />
      <Route path="/channels"    element={<RequireAuth><AppLayout><Channels /></AppLayout></RequireAuth>} />
      <Route path="/reports"     element={<RequireAuth><AppLayout><Reports /></AppLayout></RequireAuth>} />
      <Route path="/settings"    element={<RequireAuth><AppLayout><SettingsPage /></AppLayout></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration:3500, style:{ fontSize:13, fontFamily:'Inter, sans-serif' } }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
