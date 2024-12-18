import React from "react";

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
    <h2 className="text-2xl mb-8">Dashboard</h2>
    <ul className="space-y-4">
      <li>
        <a href="#" className="block py-2 px-3 rounded bg-blue-400">
          Overview
        </a>
      </li>
      <li>
        <a
          href="village.html"
          className="block py-2 px-3 rounded hover:bg-blue-400"
        >
          Village Management
        </a>
      </li>
      <li>
        <a
          href="chat.html"
          className="block py-2 px-3 rounded hover:bg-blue-400"
        >
          Chat
        </a>
      </li>
      <li>
        <a
          href="gallery.html"
          className="block py-2 px-3 rounded hover:bg-blue-400"
        >
          Gallery
        </a>
      </li>
    </ul>
    <div className="mt-auto flex items-center">
      <img
        src="admin.png"
        alt="Admin Profile"
        className="w-10 h-10 rounded-full mr-3"
      />
      <span>Osamah</span>
      <a href="#" className="ml-auto text-red-500 font-bold">
        Logout
      </a>
    </div>
  </aside>
);

export default Sidebar;
