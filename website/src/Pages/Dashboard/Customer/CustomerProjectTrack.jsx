import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const CustomerProjectTrack = () => {
  const [formData, setFormData] = useState({
    cementQty: '',
    cementPrice: '',
    bricksQty: '',
    bricksPrice: '',
    sandQty: '',
    sandPrice: '',
    steelQty: '',
    steelPrice: '',
    tilesQty: '',
    tilesPrice: '',
    paintQty: '',
    paintPrice: '',
    electricalMaterialsQty: '',
    electricalMaterialsPrice: '',
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...formData,
      date: new Date().toLocaleDateString()
    };
    setTableData([...tableData, entry]);
    setFormData({
      cementQty: '',
      cementPrice: '',
      bricksQty: '',
      bricksPrice: '',
      sandQty: '',
      sandPrice: '',
      steelQty: '',
      steelPrice: '',
      tilesQty: '',
      tilesPrice: '',
      paintQty: '',
      paintPrice: '',
      electricalMaterialsQty: '',
      electricalMaterialsPrice: '',
    });
  };

  const materialIcons = {
    cement: '🏗',
    bricks: '🧱',
    sand: '🏖',
    steel: '⚙',
    tiles: '🔲',
    paint: '🎨',
    electricalMaterials: '⚡'
  };

  const [projectBudget, setProjectBudget] = useState(100000);

  const totalSpend = tableData.reduce((acc, entry) => {
    const entryCost = [
      'cement', 'bricks', 'sand', 'steel', 'tiles', 'paint', 'electricalMaterials'
    ].reduce((sum, item) => {
      return sum + (Number(entry[`${item}Price`]) || 0);
    }, 0);
    return acc + entryCost;
  }, 0);

  const progressPercentage = projectBudget > 0
    ? Math.min(100, Math.round((totalSpend / projectBudget) * 100))
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <div className="container">

        {/* Progress Card */}
        <div className="card shadow-lg border-0 mb-4" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <div className="card-body text-center p-5">
            <h2 className="text-white mb-4" style={{ fontWeight: '600', fontSize: '2rem' }}>
              📊 Overall Project Progress
            </h2>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div
                className="position-relative"
                style={{
                  width: '200px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="200" height="200" className="position-absolute" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - progressPercentage / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'all 0.5s ease' }}
                  />
                </svg>
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h1 className="text-white mb-0" style={{ fontSize: '3.5rem', fontWeight: '700' }}>
                    {progressPercentage}%
                  </h1>
                  <p className="text-white-50 mt-2 mb-0" style={{ fontSize: '0.9rem' }}>Complete</p>
                </div>
              </div>
            </div>

            <div className="row justify-content-center mt-4 text-start">
              <div className="col-md-8 col-lg-6">
                <div className="bg-white p-3 rounded-4 shadow-sm" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-semibold text-muted" style={{ fontSize: '1.1rem' }}>Total Budget (₹)</span>
                    <input
                      type="number"
                      className="form-control text-end fw-bold"
                      style={{ width: '150px', border: '1px solid #667eea', color: '#667eea', fontSize: '1.1rem' }}
                      value={projectBudget}
                      onChange={(e) => setProjectBudget(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-muted" style={{ fontSize: '1.1rem' }}>Total Spent (₹)</span>
                    <span className="fs-4 fw-bold" style={{ color: '#28a745' }}>₹{totalSpend.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {false && (
          <>
            {/* Form Card */}
            <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: '20px', background: '#fff' }}>
              <div className="card-body p-4">
                <h3 className="mb-4" style={{
                  color: '#667eea',
                  fontWeight: '600',
                  borderBottom: '3px solid #667eea',
                  paddingBottom: '0.5rem',
                  display: 'inline-block'
                }}>
                  ✏ Enter Material Details
                </h3>

                <form onSubmit={handleSubmit}>
                  {/* Quantity Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ color: '#764ba2', fontWeight: '600' }}>
                      📦 Quantities
                    </h5>
                    <div className="row g-3">
                      {[
                        'cement',
                        'bricks',
                        'sand',
                        'steel',
                        'tiles',
                        'paint',
                        'electricalMaterials',
                      ].map((item) => (
                        <div className="col-md-4 col-lg-3" key={`${item}Qty`}>
                          <label className="form-label fw-semibold" style={{ color: '#333' }}>
                            {materialIcons[item]} {item.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              border: 'none'
                            }}>
                              Qty
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              name={`${item}Qty`}
                              value={formData[`${item}Qty`]}
                              onChange={handleChange}
                              placeholder="Enter quantity"
                              required
                              style={{
                                borderLeft: 'none',
                                borderColor: '#e0e0e0',
                                transition: 'all 0.3s ease'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mb-4">
                    <h5 className="mb-3" style={{ color: '#764ba2', fontWeight: '600' }}>
                      💰 Prices
                    </h5>
                    <div className="row g-3">
                      {[
                        'cement',
                        'bricks',
                        'sand',
                        'steel',
                        'tiles',
                        'paint',
                        'electricalMaterials',
                      ].map((item) => (
                        <div className="col-md-4 col-lg-3" key={`${item}Price`}>
                          <label className="form-label fw-semibold" style={{ color: '#333' }}>
                            {materialIcons[item]} {item.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              border: 'none'
                            }}>
                              ₹
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              name={`${item}Price`}
                              value={formData[`${item}Price`]}
                              onChange={handleChange}
                              placeholder="Enter price"
                              required
                              style={{
                                borderLeft: 'none',
                                borderColor: '#e0e0e0',
                                transition: 'all 0.3s ease'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg px-5"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        padding: '0.75rem 2.5rem',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                      }}
                    >
                      ✅ Submit Entry
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Table Card */}
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px', background: '#fff' }}>
              <div className="card-body p-4">
                <h3 className="mb-4" style={{
                  color: '#667eea',
                  fontWeight: '600',
                  borderBottom: '3px solid #667eea',
                  paddingBottom: '0.5rem',
                  display: 'inline-block'
                }}>
                  📋 Material Usage History
                </h3>

                {tableData.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>
                      No entries yet. Submit your first material entry above!
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
                      <thead style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                      }}>
                        <tr>
                          <th>Date</th>
                          <th>Cement Qty</th>
                          <th>Cement Price</th>
                          <th>Bricks Qty</th>
                          <th>Bricks Price</th>
                          <th>Sand Qty</th>
                          <th>Sand Price</th>
                          <th>Steel Qty</th>
                          <th>Steel Price</th>
                          <th>Tiles Qty</th>
                          <th>Tiles Price</th>
                          <th>Paint Qty</th>
                          <th>Paint Price</th>
                          <th>Electrical Qty</th>
                          <th>Electrical Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((entry, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid #e0e0e0',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f8f9fa';
                              e.currentTarget.style.transform = 'scale(1.01)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <td style={{ fontWeight: '600', color: '#667eea' }}>{entry.date}</td>
                            <td>{entry.cementQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.cementPrice}</td>
                            <td>{entry.bricksQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.bricksPrice}</td>
                            <td>{entry.sandQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.sandPrice}</td>
                            <td>{entry.steelQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.steelPrice}</td>
                            <td>{entry.tilesQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.tilesPrice}</td>
                            <td>{entry.paintQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.paintPrice}</td>
                            <td>{entry.electricalMaterialsQty}</td>
                            <td style={{ color: '#28a745', fontWeight: '500' }}>₹{entry.electricalMaterialsPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
