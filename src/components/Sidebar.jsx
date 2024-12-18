import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-full md:w-64 bg-gray-800 flex flex-col p-4 text-white">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="flex-grow space-y-4">
        <li>
          <Link
            to="/main"
            className={`block p-2 rounded ${
              currentPath === "/main" ? "bg-custom-gray-blue" : "hover:bg-blue-500"
            }`}
          >
            Overview
          </Link>
        </li>
        <li>
          <Link
            to="/village"
            className={`block p-2 rounded ${
              currentPath === "/village"
                ? "bg-custom-gray-blue"
                : "hover:bg-blue-500"
            }`}
          >
            Village Management
          </Link>
        </li>
        <li>
          <Link
            to="/chat"
            className={`block p-2 rounded ${
              currentPath === "/chat" ? "bg-custom-gray-blue" : "hover:bg-blue-500"
            }`}
          >
            Chat
          </Link>
        </li>
        <li>
          <Link
            to="/gallery"
            className={`block p-2 rounded ${
              currentPath === "/gallery"
                ? "bg-custom-gray-blue"
                : "hover:bg-blue-500"
            }`}
          >
            Gallery
          </Link>
        </li>
      </ul>
      <div className="mt-auto flex items-center">
        <img
          src="admin.png"
          alt="Admin Profile"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span>Osamah</span>
        <Link to="/logout" className="ml-auto text-red-500 font-bold">
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
