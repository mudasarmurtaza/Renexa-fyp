import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const ContractorProjectTrack = () => {
  const [projectBudget, setProjectBudget] = useState(100000);
  const [formData, setFormData] = useState({
    cementQty: "",
    cementPrice: "",
    bricksQty: "",
    bricksPrice: "",
    sandQty: "",
    sandPrice: "",
    steelQty: "",
    steelPrice: "",
    tilesQty: "",
    tilesPrice: "",
    paintQty: "",
    paintPrice: "",
    electricalMaterialsQty: "",
    electricalMaterialsPrice: "",
    labourCount: "",
    labourCost: "",
  });

  const [miscList, setMiscList] = useState([
    { miscItem: "", miscQty: "", miscPrice: "" },
  ]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");

  const miscItems = [
    "Transport / Vehicle Fuel",
    "Loading / Unloading Charges",
    "Safety Equipment",
    "Tools & Equipment",
    "Site Maintenance",
    "Water / Electricity Bill",
    "Permit / Admin Charges",
    "Other Miscellaneous",
  ];

  const materialIcons = {
    cement: "🏗",
    bricks: "🧱",
    sand: "🏖",
    steel: "⚙",
    tiles: "🔲",
    paint: "🎨",
    electricalMaterials: "⚡",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMiscChange = (index, e) => {
    const updated = [...miscList];
    updated[index][e.target.name] = e.target.value;
    setMiscList(updated);
  };

  const addMiscRow = () => {
    setMiscList([...miscList, { miscItem: "", miscQty: "", miscPrice: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const materials = [
      { name: "Cement", qty: formData.cementQty, price: formData.cementPrice },
      { name: "Bricks", qty: formData.bricksQty, price: formData.bricksPrice },
      { name: "Sand", qty: formData.sandQty, price: formData.sandPrice },
      { name: "Steel", qty: formData.steelQty, price: formData.steelPrice },
      { name: "Tiles", qty: formData.tilesQty, price: formData.tilesPrice },
      { name: "Paint", qty: formData.paintQty, price: formData.paintPrice },
      {
        name: "Electrical Materials",
        qty: formData.electricalMaterialsQty,
        price: formData.electricalMaterialsPrice,
      },
    ];

    // Validation
    for (let m of materials) {
      const q = Number(m.qty || 0);
      const p = Number(m.price || 0);
      if ((q > 0 && p === 0) || (p > 0 && q === 0)) {
        setError(
          `⚠ Please fill both Quantity and Price for ${m.name}, or leave both empty.`
        );
        return;
      }
    }

    if (!formData.labourCount || !formData.labourCost) {
      setError("⚠ Please fill both Total Number of Labours and Labour Cost.");
      return;
    }

    const computedMaterials = materials
      .filter((m) => Number(m.qty) > 0 && Number(m.price) > 0)
      .map((m) => ({
        ...m,
        total: Number(m.qty) * Number(m.price),
      }));

    const materialTotal = computedMaterials.reduce(
      (sum, m) => sum + m.total,
      0
    );

    const miscTotal = miscList.reduce(
      (sum, m) => sum + Number(m.miscPrice || 0),
      0
    );

    const additionalTotal =
      Number(formData.labourCost || 0) + Number(miscTotal);

    const total = materialTotal + additionalTotal;

    const entry = {
      date: new Date().toLocaleDateString(),
      materials: computedMaterials,
      labourCount: formData.labourCount,
      labourCost: formData.labourCost,
      miscList,
      materialTotal,
      additionalTotal,
      total,
    };

    setTableData([...tableData, entry]);

    setFormData({
      cementQty: "",
      cementPrice: "",
      bricksQty: "",
      bricksPrice: "",
      sandQty: "",
      sandPrice: "",
      steelQty: "",
      steelPrice: "",
      tilesQty: "",
      tilesPrice: "",
      paintQty: "",
      paintPrice: "",
      electricalMaterialsQty: "",
      electricalMaterialsPrice: "",
      labourCount: "",
      labourCost: "",
    });
    setMiscList([{ miscItem: "", miscQty: "", miscPrice: "" }]);
  };

  const grandTotal = tableData.reduce((sum, row) => sum + row.total, 0);

  const progressPercentage = projectBudget > 0
    ? Math.min(100, Math.round((grandTotal / projectBudget) * 100))
    : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem 0",
      }}
    >
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
                    <span className="fs-4 fw-bold" style={{ color: '#28a745' }}>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div
          className="card shadow-lg border-0 mb-4"
          style={{ borderRadius: "20px", background: "#fff" }}
        >
          <div className="card-body p-4">
            <h3
              className="mb-4"
              style={{
                color: "#667eea",
                fontWeight: "600",
                borderBottom: "3px solid #667eea",
                paddingBottom: "0.5rem",
                display: "inline-block",
              }}
            >
              ✏ Enter Material Details
            </h3>

            {error && (
              <div className="alert alert-danger fw-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Quantities & Prices */}
              <div className="mb-4">
                <h5 style={{ color: "#764ba2", fontWeight: "600" }}>
                  📦 Quantities & Prices
                </h5>
                <div className="row g-3">
                  {[
                    "cement",
                    "bricks",
                    "sand",
                    "steel",
                    "tiles",
                    "paint",
                    "electricalMaterials",
                  ].map((item) => (
                    <div className="col-md-6 col-lg-4" key={item}>
                      <label className="form-label fw-semibold">
                        {materialIcons[item]} {item.replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name={`${item}Qty`}
                          value={formData[`${item}Qty`]}
                          onChange={handleChange}
                          placeholder="Enter quantity"
                        />
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name={`${item}Price`}
                          value={formData[`${item}Price`]}
                          onChange={handleChange}
                          placeholder="Enter price (₹)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labour */}
              <div className="mb-4">
                <h5 style={{ color: "#764ba2", fontWeight: "600" }}>
                  👷 Labour Details
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Total Number of Labours
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      name="labourCount"
                      value={formData.labourCount}
                      onChange={handleChange}
                      placeholder="Enter total labours"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Total Labour Cost
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      name="labourCost"
                      value={formData.labourCost}
                      onChange={handleChange}
                      placeholder="Enter labour cost (₹)"
                    />
                  </div>
                </div>
              </div>

              {/* Miscellaneous */}
              <div className="mb-4">
                <h5 style={{ color: "#764ba2", fontWeight: "600" }}>
                  🧾 Miscellaneous
                </h5>
                {miscList.map((misc, index) => (
                  <div className="row g-2 mb-2" key={index}>
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        name="miscItem"
                        value={misc.miscItem}
                        onChange={(e) => handleMiscChange(index, e)}
                      >
                        <option value="">-- Select Item --</option>
                        {miscItems.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="miscQty"
                        value={misc.miscQty}
                        onChange={(e) => handleMiscChange(index, e)}
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="miscPrice"
                        value={misc.miscPrice}
                        onChange={(e) => handleMiscChange(index, e)}
                        placeholder="Enter price (₹)"
                      />
                    </div>
                  </div>
                ))}
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={addMiscRow}
                  >
                    ➕ Add More
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-lg px-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: "50px",
                    fontWeight: "600",
                  }}
                >
                  ✅ Submit Entry
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Table */}
        <div className="table-responsive mt-5">
          {tableData.map((entry, idx) => (
            <div key={idx} className="mb-5">
              <h5 className="fw-bold text-white">📅 Date: {entry.date}</h5>

              <table className="table table-bordered text-center align-middle mt-3 bg-white">
                <thead
                  style={{
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    color: "white",
                  }}
                >
                  <tr>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Price (₹/unit)</th>
                    <th>Total Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.materials.map((m, i) => (
                    <tr key={i}>
                      <td>{m.name}</td>
                      <td>{m.qty}</td>
                      <td>₹{m.price}</td>
                      <td>₹{m.total}</td>
                    </tr>
                  ))}
                  <tr className="table-light fw-bold">
                    <td colSpan="3">Total Material Cost</td>
                    <td>₹{entry.materialTotal}</td>
                  </tr>
                  <tr>
                    <td>Labour ({entry.labourCount} Workers)</td>
                    <td>-</td>
                    <td>-</td>
                    <td>₹{entry.labourCost}</td>
                  </tr>
                  {entry.miscList.map(
                    (m, i) =>
                      m.miscItem && (
                        <tr key={i}>
                          <td>{m.miscItem}</td>
                          <td>{m.miscQty}</td>
                          <td>-</td>
                          <td>₹{m.miscPrice}</td>
                        </tr>
                      )
                  )}
                  <tr className="table-info fw-bold">
                    <td colSpan="3">Total Additional Expenses</td>
                    <td>₹{entry.additionalTotal}</td>
                  </tr>
                  <tr className="table-success fw-bold">
                    <td colSpan="3">Grand Total</td>
                    <td>₹{entry.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}

          {tableData.length > 0 && (
            <div className="alert alert-success text-end fw-bold fs-5">
              🧮 Grand Total for All Entries: ₹{grandTotal}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
