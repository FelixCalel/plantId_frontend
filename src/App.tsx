import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import PlantsPage from "./components/Plants/PlantsPage";
import PlantForm from "./components/Plants/PlantForm";
import FamiliesPage from "./components/Families/FamiliesPage";
import IdentificationPage from "./components/Identificaction/IdentificationPage";
import ChatPage from "./components/chat/ChatPage";

const App: React.FC = () => (
  <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Navigate to="/identify" replace />} />
      <Route path="/identify" element={<IdentificationPage />} />
      <Route path="/plants" element={<PlantsPage />} />
      <Route path="/plants/new" element={<PlantForm />} />
      <Route path="/plants/:id" element={<PlantForm />} />
      <Route path="/families" element={<FamiliesPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  </>
);

export default App;
