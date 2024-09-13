import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Ranking from './components/Ranking';
import ProtectedRoute from './components/ProtectedRoute';
import UserProvider, {UserContext} from './context/UserContext';  // Solo importamos el UserProvider aquí
import AsideAdmin from './components/AsideAdmin';
import AsideRunner from './components/AsideRunner';
import { useContext } from 'react';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};


const AppContent = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex md:flex-row flex-col">
      {/* Mostrar el aside según el rol del usuario */}
      {user?.rol === 'admin' && <AsideAdmin />}
      {user?.rol === 'corredor' && <AsideRunner />}

      <div className={`flex-1 p-4 ${user ? 'md:ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
