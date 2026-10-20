import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import AppShell from "./layouts/AppShell";
import ConversationPage from "./pages/ConversationPage";
import IncidentsPage from "./pages/IncidentsPage";
import LoginPage from "./pages/LoginPage";
import MachinesPage from "./pages/MachinesPage";

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={user ? <AppShell /> : <Navigate to="/login" replace />}>
        <Route path="/machines" element={<MachinesPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/chat" element={<ConversationPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={user ? "/machines" : "/login"} replace />}
      />
    </Routes>
  );
}
