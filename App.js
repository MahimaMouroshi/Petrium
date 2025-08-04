import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import AdminLogin from "../components/Auth/AdminLogin";
import AdminDashboard from "./AdminDashboard";
import PetForm from "../components/PetForm";
import PetList from "../components/PetList";
import Cart from "../components/Cart";
import ConfirmOrder from "../components/ConfirmOrder";
import UserProfile from "./UserProfile";

import { UserProvider } from "../Context/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/add-pet" element={<PetForm />} />
          <Route path="/all-pets" element={<PetList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />

          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
