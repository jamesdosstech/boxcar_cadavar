import React, { useEffect, useState } from "react";
import StatCard from "../../../components/admin/StatCard";
import RecentOrders from "../../../components/admin/RecentOrders";
import ActivityLog from "../../../components/admin/ActivityLog";
import './dashboard-overview.scss';

const Home = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      const data = null
      // const data = await fetchAdminStats(); // Fetch data from backend
      setStats(data);
    }
    getStats();
  }, []);

  return (
    <div className="dashboard-overview">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="Total Sales" value={`$${stats?.totalSales}`} />
        <StatCard title="Total Orders" value={stats?.totalOrders} />
        <StatCard title="Active Users" value={stats?.activeUsers} />
        <StatCard title="Video Engagement" value={stats?.videoViews} />
      </div>
      <RecentOrders orders={stats?.recentOrders} />
      <ActivityLog logs={stats?.userActivity} />
    </div>
  );
};

export default Home;
