import { useState } from "react";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === "STUDENT") {
    return <StudentDashboard />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome {role}! Dashboard coming soon...
      </h1>
    </div>
  );
}

export default App;