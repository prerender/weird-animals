import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/homepage/Homepage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetailPage from "./pages/CategoriesDetailPage";
import AnimalDetailPage from "./pages/AnimalDetailsPage";
import SlothPage from "./pages/SlothPage";

// Flips window.prerenderReady to true once a fast page has mounted.
// Slow pages (e.g. /sloth) opt out and manage the signal themselves.
function PrerenderReadySignal() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/sloth")) return;
    window.prerenderReady = true;
  }, [location.pathname]);
  return null;
}

function App() {
  const location =
    typeof window !== "undefined" ? window.location : { pathname: "/" };
  // Prevent React app from rendering on /admin or any /admin/* path
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Router>
      <PrerenderReadySignal />
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
          <Route path="/sloth" element={<SlothPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
