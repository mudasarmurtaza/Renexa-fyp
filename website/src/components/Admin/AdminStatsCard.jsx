import React from 'react';

const AdminStatsCard = ({ title, value }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card bg-primary text-white h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text fs-3">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCard;
