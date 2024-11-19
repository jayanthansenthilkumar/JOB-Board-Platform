import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-lg font-bold">Job Board</Link>
        <div>
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/register" className="bg-blue-500 px-3 py-2 rounded">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
