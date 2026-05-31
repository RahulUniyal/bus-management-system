import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [busNumber, setBusNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [timing, setTiming] = useState("");
  const [stops, setStops] = useState("");
  const [message, setMessage] = useState("");
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/dashboard", { headers })
      .then(res => setDashboard(res.data))
      .catch(err => console.log(err));
  }, []);

  const addBus = async () => {
    try {
      await axios.post("http://localhost:8080/api/buses", {
        busNumber, capacity: parseInt(capacity),
        startPoint, endPoint, timing, stops
      }, { headers });
      setMessage("✅ Bus added successfully!");
      // Refresh dashboard
      const res = await axios.get("http://localhost:8080/api/admin/dashboard", { headers });
      setDashboard(res.data);
    } catch (err) {
      setMessage("❌ Error adding bus!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!dashboard) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🛠️ Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>👋 {name}</span>
          <button onClick={handleLogout}
            className="bg-white text-purple-600 px-3 py-1 rounded-lg text-sm font-semibold">
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{dashboard.totalUsers}</p>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{dashboard.totalBuses}</p>
            <p className="text-gray-500 text-sm">Total Buses</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{dashboard.totalStudents}</p>
            <p className="text-gray-500 text-sm">Students</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{dashboard.activeDelayAlerts}</p>
            <p className="text-gray-500 text-sm">Active Alerts</p>
          </div>
        </div>

        {/* Add Bus Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">➕ Add New Bus</h2>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
              {message}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Bus Number" value={busNumber}
              onChange={e => setBusNumber(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
            <input placeholder="Capacity" value={capacity}
              onChange={e => setCapacity(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
            <input placeholder="Start Point" value={startPoint}
              onChange={e => setStartPoint(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
            <input placeholder="End Point" value={endPoint}
              onChange={e => setEndPoint(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
            <input placeholder="Timing (e.g. 8:00 AM)" value={timing}
              onChange={e => setTiming(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
            <input placeholder="Stops (comma separated)" value={stops}
              onChange={e => setStops(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500" />
          </div>
          <button onClick={addBus}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">
            Add Bus
          </button>
        </div>

        {/* All Buses */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🚌 All Buses</h2>
          {dashboard.allBuses.map(bus => (
            <div key={bus.id} className="border-b py-3">
              <p className="font-bold text-blue-600">{bus.busNumber}</p>
              <p className="text-gray-600 text-sm">{bus.startPoint} → {bus.endPoint} | {bus.timing}</p>
              <p className="text-gray-500 text-sm">Stops: {bus.stops}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;