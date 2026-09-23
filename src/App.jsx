import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import Usuarios from './components/Usuarios/UsuariosPage';

function PrivateRoute({ children }) {
  const usuarioGuardado = localStorage.getItem('usuario');
  return usuarioGuardado ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (!usuarioGuardado) return <Navigate to="/login" replace />;

  try {
    const usuario = JSON.parse(usuarioGuardado);
    return usuario?.rol === 'ADMIN' ? children : <Navigate to="/dashboard" replace />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Reemplaza la ruta del dashboard por esta para usar la vista directa */}
        <Route path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <AdminRoute>
              <Usuarios />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;