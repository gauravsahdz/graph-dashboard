import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import data from "../eve.json";

const Dashboard = () => {
  const processData = (data) => {
    const alerts = data.filter(
      (event) => event.event_type === "alert" && event.alert
    );

    const alertsOverTime = alerts.map((alert) => ({
      timestamp: alert.timestamp,
      count: 1,
    }));

    const categoryCounts = alerts.reduce((acc, alert) => {
      const category = alert.alert.category || "Unknown";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const sourceIpCounts = alerts.reduce((acc, alert) => {
      acc[alert.src_ip] = (acc[alert.src_ip] || 0) + 1;
      return acc;
    }, {});

    return {
      alertsOverTime,
      categoryCounts: Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
      })),
      sourceIpCounts: Object.entries(sourceIpCounts).map(([name, value]) => ({
        name,
        value,
      })),
    };
  };

  const { alertsOverTime, categoryCounts, sourceIpCounts } = processData(data);

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  return (
    <div
      style={{
        backgroundColor: "#2c2c2c",
        color: "#fff",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <h1>Security Alerts Dashboard</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "45%", margin: "20px 0" }}>
          <h2>Alerts Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={alertsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: "45%", margin: "20px 0" }}>
          <h2>Alert Categories Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryCounts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryCounts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: "45%", margin: "20px 0" }}>
          <h2>Source IP Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceIpCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
