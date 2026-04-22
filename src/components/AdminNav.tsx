import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.js';
import { useTheme } from '../contexts/ThemeContext.js';

const AdminNav: React.FC = () => {
  const { theme } = useTheme();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">SteamClean</Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!token ? (
            <Link to="/login" className={`px-4 py-2 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition`}>
              Administración
            </Link>
          ) : (
            <>
              <span className="mr-4">Hola, {user?.username}</span>
              <Link to="/admin" className={`px-4 py-2 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition`}>
                Panel
              </Link>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white rounded transition`}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;