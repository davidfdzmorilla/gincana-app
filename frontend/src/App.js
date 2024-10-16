import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useContext } from "react";
import UserProvider, { UserContext } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Ranking from "./components/Ranking";
import AsideAdmin from "./components/AsideAdmin";
import AsideRunner from "./components/AsideRunner";
import AddUser from "./components/AddUser";
import DeleteUser from "./components/DeleteUser";
import Chrono from "./components/Chrono";
import UserProfile from "./components/UserProfile";
import RankingPublic from "./components/RankingPublic";
import NotFound from "./components/NotFound";

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
  const location = useLocation();

  return (
    <div className="flex md:flex-row flex-col">
      <div className={`flex-1 ${user && location.pathname !== '/dashboard/public-rank' && location.pathname !== '/' ? "md:ml-64" : ""}`}>
        {/* Mostrar el aside según el rol del usuario */}
        {user?.rol === "admin" && location.pathname !== '/dashboard/public-rank' && location.pathname !== '/' && <AsideAdmin />}
        {user?.rol === "corredor" && location.pathname !== '/dashboard/public-rank' && location.pathname !== '/' && <AsideRunner />}
        <Routes>
          <Route path="/dashboard/" element={<Login />} />
          <Route path="/dashboard/login" element={<Login />} />
          <Route path="/dashboard/public-rank" element={<RankingPublic />} />
          <Route
            path="/dashboard/ranking"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chrono"
            element={
              <ProtectedRoute>
                <Chrono />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add-user"
            element={
              <ProtectedRoute>
                {user?.rol === "admin" && <AddUser />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/delete-user"
            element={
              <ProtectedRoute>
                {user?.rol === "admin" && <DeleteUser />}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
