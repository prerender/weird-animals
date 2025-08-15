import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "./Homepage";
import Categories from "./Categories";
import Details from "./Details";

function App() {
  const location =
    typeof window !== "undefined" ? window.location : { pathname: "/" };
  // Prevent React app from rendering on /admin or any /admin/* path
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Router>
      <nav className="bg-blue-500 text-white p-4 mb-8">
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/categories" className="hover:underline">
            Categories
          </Link>
          <Link to="/details" className="hover:underline">
            Details
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
