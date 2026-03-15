import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminStatsCard from '../../../components/Admin/AdminStatsCard';
import AdminCharts from '../../../components/Admin/AdminCharts';
import AdminRecentTables from '../../../components/Admin/AdminRecentTables';
import { ClipLoader } from 'react-spinners'; // For loading spinner

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login'); // Redirect to login if no token
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [statsRes, chartsRes, recentRes] = await Promise.all([
          axios.get('/admin/dashboard/stats', config),
          axios.get('/admin/dashboard/charts', config),
          axios.get('/admin/dashboard/recent-data', config),
        ]);

        setStats(statsRes.data);
        setChartsData(chartsRes.data);
        setRecentData(recentRes.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
        if (err.response && err.response.status === 403) {
          navigate('/admin/login'); // Redirect if not authorized
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <ClipLoader color="#007bff" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard p-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <section className="stats-cards mb-5">
        <div className="row">
          {stats && (
            <>
              <AdminStatsCard title="Total Contractors" value={stats.totalContractors} />
              <AdminStatsCard title="Total Customers" value={stats.totalCustomers} />
              <AdminStatsCard title="Pending Contractors" value={stats.pendingContractorRequests} />
              <AdminStatsCard title="Running Bids" value={stats.totalRunningBids} />
              <AdminStatsCard title="Successful Bids" value={stats.totalSuccessfulBids} />
              <AdminStatsCard title="Total Projects Posted" value={stats.totalProjectsPosted} />
              <AdminStatsCard title="Open Projects" value={stats.openProjects} />
              <AdminStatsCard title="Closed Projects" value={stats.closedProjects} />
              <AdminStatsCard title="Rejected Proposals" value={stats.rejectedProposals} />
              <AdminStatsCard title="New Registrations (7 Days)" value={stats.newRegistrationsLast7Days} />
              <AdminStatsCard title="Monthly Revenue (Est)" value={`$${stats.monthlyRevenue.toFixed(2)}`} />
            </>
          )}
        </div>
      </section>

      <section className="charts-section mb-5">
        <h2 className="mb-4">Analytics</h2>
        {chartsData && <AdminCharts chartsData={chartsData} />} 
      </section>

      <section className="tables-section">
        <h2 className="mb-4">Recent Activities</h2>
        {recentData && <AdminRecentTables recentData={recentData} />} 
      </section>
    </div>
  );
};

export default AdminDashboard;
