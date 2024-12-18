import React from "react";

const Sidebar = () => (
  <aside className="w-full md:w-64 bg-gray-800 flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="flex-grow space-y-4">
        <li>
          <a href="#" className="block p-2 rounded bg-custom-gray-blue">
            Overview
          </a>
        </li>
        <li>
          <a
            href="village.html"
            className="block p-2 rounded hover:bg-blue-500"
          >
            Village Management
          </a>
        </li>
        <li>
          <a href="chat.html" className="block p-2 rounded hover:bg-blue-500">
            Chat
          </a>
        </li>
        <li>
          <a
            href="gallery.html"
            className="block p-2 rounded hover:bg-blue-500"
          >
            Gallery
          </a>
        </li>
      </ul>
      <div className="mt-auto flex items-center">
        <img
          src="admin.png"
          alt="Admin Profile"
          className="w-10 h-10 rounded-full mr-2"
        />
        <span>Osamah</span>
        <a href="#" className="ml-auto text-red-500 font-bold">
          Logout
        </a>
      </div>
    </aside>
);

export default Sidebar;
