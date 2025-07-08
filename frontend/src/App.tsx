// frontend/src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import CompaniesPage from "./pages/Companies/CompaniesPage";
// (We’ll add other pages later…)
import ContactsPage from "./pages/Contacts/ContactsPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-100">
        {/* Simple nav links */}
        <Link to="/" className="mr-4">Dashboard</Link>
        <Link to="/companies" className="mr-4">Companies</Link>
        <Link to="/contacts" className="mr-4">Contacts</Link>
        {/* Add other links as you build pages */}
      </nav>

      <Routes>
        <Route path="/" element={<div className="p-4">Welcome to your CRM</div>} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        {/* Future routes:
           <Route path="contacts" element={<ContactsPage />} />
           <Route path="opportunities" element={<OpportunitiesPage />} />
           … */}
      </Routes>
    </BrowserRouter>
  );
}