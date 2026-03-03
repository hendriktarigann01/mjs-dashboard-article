import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import "@fontsource/poppins";

import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import CreateNews from "./pages/CreateNews";
import Published from "./pages/Published";
import Draft from "./pages/Draft";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write/create-news"
          element={
            <ProtectedRoute>
              <CreateNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/published"
          element={
            <ProtectedRoute>
              <Published />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drafts"
          element={
            <ProtectedRoute>
              <Draft />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
