import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RankingPublic from "./components/RankingPublic";

const PublicRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/public-rank" element={<RankingPublic />} />
      </Routes>
    </Router>
  );
};

export default PublicRoute;
