import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import AddItem from "./pages/AddItem";
import Donations from "./pages/Donations";
import Leaderboard from "./pages/Leaderboard";
import Exchange from "./pages/Exchange";
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";

function Home() {
  return (
    <div>
      <h1>🌱 Welcome to EcoLoop</h1>
      <p>Reuse More. Waste Less. Make a Difference.</p>
    </div>
  );
}

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
