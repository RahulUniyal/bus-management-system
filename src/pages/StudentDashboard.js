import { useState, useEffect } from "react";
import axios from "axios";

function StudentDashboard() {
  const [buses, setBuses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [absentMessage, setAbsentMessage] = useState("");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    // Get all buses
    axios.get("http://localhost:8080/api/buses", { headers })
      .then(res => setBuses(res.data))
      .catch(err => console.log(err));

    // Get notifications
    axios.get("http://localhost:8080/api/notifications", { headers })
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  }, []);

  const markAbsent = async (busId) => {
    const studentId = 1; // temporary
    try {
      await axios.post(
        `http://localhost:8080/api/attendance/absent?studentId=${studentId}&busId=${busId}`,
        {},
        { headers }
      );
      setAbsentMessage("✅ Marked as absent for today!");
    } catch (err) {
      setAbsentMessage("❌ Already marked or error!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🚌 Bus Management</h1>
        <div className="flex items-center gap-4">
          <span>👋 {name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Absent Message */}
        {absentMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
            {absentMessage}
          </div>
        )}

        {/* Buses */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚌 Your Buses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {buses.map(bus => (
            <div key={bus.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-blue-600">{bus.busNumber}</h3>
                  <p className="text-gray-600 text-sm mt-1">📍 {bus.startPoint} → {bus.endPoint}</p>
                  <p className="text-gray-600 text-sm">🕐 {bus.timing}</p>
                  <p className="text-gray-600 text-sm">🛑 Stops: {bus.stops}</p>
                  <p className="text-gray-600 text-sm">💺 Capacity: {bus.capacity}</p>
                </div>
                <button
                  onClick={() => markAbsent(bus.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
                >
                  Not Coming Today
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet!</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="bg-white rounded-xl shadow p-4 mb-3">
              <h3 className="font-bold text-gray-800">{n.title}</h3>
              <p className="text-gray-600 text-sm">{n.message}</p>
              <span className="text-xs text-blue-500">{n.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;