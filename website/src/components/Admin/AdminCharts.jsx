import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666'];

const AdminCharts = ({ chartsData }) => {
  const { proposalStatusDistribution, monthlyProjectsPosted, projectStatusDistribution } = chartsData;

  // Format monthlyProjectsPosted for LineChart
  const formattedMonthlyProjects = monthlyProjectsPosted.map(data => ({
    name: `${data._id.year}-${String(data._id.month).padStart(2, '0')}`,
    projects: data.count,
  }));

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100 p-3">
          <h4 className="mb-3">Proposal Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={proposalStatusDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card h-100 p-3">
          <h4 className="mb-3">Monthly Projects Posted</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedMonthlyProjects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="projects" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card h-100 p-3">
          <h4 className="mb-3">Project Status Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {projectStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
