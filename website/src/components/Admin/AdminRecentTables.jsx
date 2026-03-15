import React from 'react';

const AdminRecentTables = ({ recentData }) => {
  const { latestContractorRegistrations, latestProjectsPosted, recentAcceptedProposals } = recentData;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100 p-3">
          <h4 className="mb-3">Latest Contractor Registrations</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {latestContractorRegistrations.map((contractor) => (
                  <tr key={contractor._id}>
                    <td>{contractor.name}</td>
                    <td>{contractor.email}</td>
                    <td>{formatDate(contractor.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card h-100 p-3">
          <h4 className="mb-3">Latest Projects Posted</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Customer</th>
                  <th>Posted On</th>
                </tr>
              </thead>
              <tbody>
                {latestProjectsPosted.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.customer.name}</td>
                    <td>{formatDate(project.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-md-12 mb-4">
        <div className="card h-100 p-3">
          <h4 className="mb-3">Recent Accepted Proposals</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Contractor</th>
                  <th>Customer</th>
                  <th>Price</th>
                  <th>Accepted On</th>
                </tr>
              </thead>
              <tbody>
                {recentAcceptedProposals.map((proposal) => (
                  <tr key={proposal._id}>
                    <td>{proposal.project.title}</td>
                    <td>{proposal.contractor.name}</td>
                    <td>{proposal.customer.name}</td>
                    <td>${proposal.price.toFixed(2)}</td>
                    <td>{formatDate(proposal.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRecentTables;
