// frontend/src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import CompaniesPage from "./pages/Companies/CompaniesPage";
// (We’ll add other pages later…)
import ContactsPage from "./pages/Contacts/ContactsPage";
import OpportunitiesPage from "./pages/Opportunities/OpportunitiesPage";
import ActivitiesPage from "./pages/Activities/ActivitiesPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-100">
        {/* Simple nav links */}
        <Link to="/" className="mr-4">Dashboard</Link>
        <Link to="/companies" className="mr-4">Companies</Link>
        <Link to="/contacts" className="mr-4">Contacts</Link>
        <Link to="/opportunities" className="mr-4">Opportunities</Link>
        <Link to="/activities" className="mr-4">Activities</Link>
        <Link to="/dashboard" className="mr-4">Reports</Link>
        <Link to="/settings" className="mr-4">Settings</Link>
        {/* Add more links as you build out the app */}
        {/* Add other links as you build pages */}
      </nav>

      <Routes>
        <Route path="/" element={<div className="p-4">Welcome to your CRM</div>} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Future routes:
           <Route path="contacts" element={<ContactsPage />} />
           <Route path="opportunities" element={<OpportunitiesPage />} />
           … */}
      </Routes>
    </BrowserRouter>
  );
}