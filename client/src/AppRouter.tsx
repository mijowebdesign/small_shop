import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/auth/RegistrationForm';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';  
import MainNavbar from './components/app/MainNavbar';
import { useAuth } from './context/AuthContext';
import UserPanel from './pages/UserPanel';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';


const AppLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <MainNavbar  />
      <main className="flex-1 overflow-y-auto " >
        {children}
      </main>
    </div>
  );
};


const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles?: ('user' | 'manager' | 'admin')[] 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Or to an Unauthorized page
  }
  
  return <AppLayout>{children}</AppLayout>;
};


const AppRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/admin-panel"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
           <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-panel"
        element={
          <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
           <UserPanel  user={user!} />
          </ProtectedRoute>
        }
      />
          <Route
        path="/manager-panel"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
           <UserPanel  user={user!} />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" /> : <RegistrationForm />} 
      />
       <Route 
        path="/details/:id" 
        element={<AppLayout><ProductDetails /></AppLayout>} 
      />
     
      <Route
        path="/products/new"
        element={
          <ProtectedRoute allowedRoles={['manager', 'admin']}>
            <AddProduct />
          </ProtectedRoute>
        }
      />

      <Route 
  path="/products/:categorySlug" 
  element={<AppLayout><Products /></AppLayout>} 
/>
      
      <Route 
        path="/" 
        element={<AppLayout><Dashboard /></AppLayout>} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter; 
