import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route} from "react-router";
import Welcome from "./pages/Welcome";
import RequireAuth from "./components/RequireAuth";
import FarmerDashboard from "./pages/FarmerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  return (
    
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route index path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />

        {/* Farmer-only */}
        <Route
          path="/farmer/"
          element={
            <RequireAuth role="farmer">
              <FarmerDashboard />
            </RequireAuth>
          }
          
        />

        {/* Customer-only */}
        <Route
          path="/customer/"
          element={
            <RequireAuth role="customer">
              <CustomerDashboard />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound/>} />
      </Routes>

      
    </BrowserRouter>
  );
}

export default App;
