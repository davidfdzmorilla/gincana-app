import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { RiUserAddFill } from "react-icons/ri";
import { MdMoreTime } from "react-icons/md";

const AsideAdmin = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (!user || user.rol !== "admin") {
    return null;
  }

  return (
    <aside className="z-10 bg-gray-800 text-white flex flex-col md:w-64 w-full h-16 md:h-screen fixed md:top-0 md:left-0 bottom-0 left-0">
      <div className="p-4 hidden md:block">
        <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
        <p>Bienvenido, {user.nombre}</p>
      </div>

      <nav className="flex grow md:flex-col flex-row justify-around w-full md:justify-end p-4 gap-y-8">
        <Link
          to="/ranking"
          className="md:mb-2 text-gray-300 hover:text-white text-center md:text-left"
        >
          <FaRankingStar className="inline" size={30} />
        </Link>
        <Link
          to="/profile"
          className="md:mb-2 text-gray-300 hover:text-white text-center md:text-left"
        >
          <FaUser className="inline" size={30} />
        </Link>
        <Link
          to="/add-user"
          className="md:mb-2 text-gray-300 hover:text-white text-center md:text-left"
        >
          <RiUserAddFill className="inline" size={30} />
        </Link>
        <Link
          to="/chrono"
          className="md:mb-2 text-gray-300 hover:text-white text-center md:text-left"
        >
          <MdMoreTime className="inline" size={30} />
        </Link>
        <span
          onClick={handleLogout}
          className="cursor-pointer bg-red-500 py-2 px-4 rounded text-white hover:bg-red-600"
        >
          <FaSignOutAlt className="inline" />
        </span>
      </nav>
    </aside>
  );
};

export default AsideAdmin;
