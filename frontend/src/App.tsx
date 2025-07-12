// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import CompaniesPage from "./pages/Companies/CompaniesPage";
import CompanyDetailPage from "./pages/Companies/CompanyDetailPage";
import ContactsPage from "./pages/Contacts/ContactsPage";
import ContactDetailPage from "./pages/Contacts/ContactDetailPage";
import OpportunitiesPage from "./pages/Opportunities/OpportunitiesPage";
import OpportunityDetailPage from "./pages/Opportunities/OpportunityDetailPage";
import ActivitiesPage from "./pages/Activities/ActivitiesPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";

export default function App() {

  return (
    <BrowserRouter>
      <ProtectedRoute>
        <Navigation />
        
        <nav className="p-4 bg-gray-100">
          <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800">Dashboard</Link>
          <Link to="/companies" className="mr-4 text-blue-600 hover:text-blue-800">Companies</Link>
          <Link to="/contacts" className="mr-4 text-blue-600 hover:text-blue-800">Contacts</Link>
          <Link to="/opportunities" className="mr-4 text-blue-600 hover:text-blue-800">Opportunities</Link>
          <Link to="/activities" className="mr-4 text-blue-600 hover:text-blue-800">Activities</Link>
          <Link to="/dashboard" className="mr-4 text-blue-600 hover:text-blue-800">Reports</Link>
          <Link to="/settings" className="mr-4 text-blue-600 hover:text-blue-800">Settings</Link>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ProtectedRoute>
    </BrowserRouter>
  );
}