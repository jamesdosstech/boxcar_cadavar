import { useEffect, useState } from "react";
import StatCard from "../../../components/admin/StatCard";
import RecentOrders from "../../../components/admin/RecentOrders";
import ActivityLog from "../../../components/admin/ActivityLog";
import { getRecentOrders, type Order } from "../../../utils/firebase/firebase.utils";
import "./dashboard-overview.scss";

type AdminStats = {
  totalSales: number;
  totalOrders: number;
  activeUsers: number;
  videoViews: number;
  recentOrders: Order[];
  userActivity: any[];
};

export default function Home() {
  const [stats, setStats] = useState<AdminStats>({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    videoViews: 0,
    recentOrders: [],
    userActivity: [],
  });

  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingOrders(true);
        setErrMsg("");

        const recentOrders = await getRecentOrders(8);

        if (!alive) return;

        setStats((prev) => ({
          ...prev,
          recentOrders,
          totalOrders: recentOrders.length, // placeholder
        }));
      } catch (e) {
        if (!alive) return;
        setErrMsg("Failed to load recent orders.");
      } finally {
        if (!alive) return;
        setIsLoadingOrders(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="dashboard-overview">
      <h1>Admin Dashboard</h1>

      {errMsg && (
        <p className="ds-error" role="alert">
          {errMsg}
        </p>
      )}

      <div className="stats-grid">
        <StatCard title="Total Sales" value={`$${stats.totalSales}`} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Video Engagement" value={stats.videoViews} />
      </div>

      <RecentOrders orders={stats.recentOrders} isLoading={isLoadingOrders} />
      <ActivityLog logs={stats.userActivity} />
    </div>
  );
}
