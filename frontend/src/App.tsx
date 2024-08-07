import React from "react";
import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateComplaintForm from "./components/CreateComplaintForm";

import NotFoundPage from "./pages/404";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RouterPage from "./pages/RouterPage";
import WorkerPage from "./pages/WorkerPage";
import SnackbarProvider from "./components/SnackbarProvider";



const App: React.FC = () => {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          TODO: have all user type in path "/" later
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/worker" element={<WorkerPage />} />
          <Route path="router" element={<RouterPage />} />
          <Route
            path="/create-complaint/:location_id"
            element={
              <CreateComplaintForm
                open={true}
                onClose={() => { }}
                onSubmit={() => { }}
                locationId={""}
                nextId={1}
              />
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>

  );
};

export default App;
