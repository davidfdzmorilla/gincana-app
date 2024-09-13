import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import UserProvider, {UserContext} from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Ranking from './components/Ranking';
import AsideAdmin from './components/AsideAdmin';
import AsideRunner from './components/AsideRunner';
import AddUser from './components/AddUser';

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
      {console.log(user)}

      <div className={`flex-1 ${user ? 'md:ml-64' : ''}`}>
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
          <Route
            path="/add-user"
            element={
              <ProtectedRoute>
                {user?.rol === 'admin' && <AddUser />}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
