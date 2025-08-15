import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/homepage/Homepage";
import CategoriesPage from "./pages/categoriesPage/CategoriesPage";
import CategoryDetailPage from "./pages/categoriesDetailsPage/CategoriesDetailPage";
import AnimalDetailPage from "./pages/animalDetailsPage/AnimalDetailsPage";

function App() {
  const location =
    typeof window !== "undefined" ? window.location : { pathname: "/" };
  // Prevent React app from rendering on /admin or any /admin/* path
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route
            path="/category/:categoryId"
            element={<CategoryDetailPage />}
          />
          <Route path="/animal/:animalId" element={<AnimalDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
