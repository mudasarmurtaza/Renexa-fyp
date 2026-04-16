import React, { useEffect, useState } from "react";
import { Star, MapPin, Briefcase, Award, MessageSquare, X, Search, Filter } from "lucide-react";
import { API_BASE_URL } from "../../../config";

/* ── Reusable star renderer ─────────────────────────────────────────── */
const StarRating = ({ value = 0, max = 5, size = 16 }) => (
  <span className="d-flex gap-1 align-items-center">
    {Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.round(value) ? "#f59e0b" : "none"}
        color={i < Math.round(value) ? "#f59e0b" : "#d1d5db"}
      />
    ))}
  </span>
);

/* ── Reviews Modal ───────────────────────────────────────────────────── */
const ReviewsModal = ({ contractor, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/contractor/${contractor._id}/reviews`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [contractor._id]);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.55)", zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{ width: "min(95vw, 560px)", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Reviews for {contractor.name}</h5>
          <button className="btn p-0" onClick={onClose}><X size={20} /></button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" />
          </div>
        )}

        {!loading && data && (
          <>
            {/* Summary */}
            <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: "#fffbeb" }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: "#f59e0b" }}>
                {data.averageRating?.toFixed(1) || "—"}
              </span>
              <div>
                <StarRating value={data.averageRating} size={18} />
                <small className="text-muted">{data.totalReviews} review{data.totalReviews !== 1 ? "s" : ""}</small>
              </div>
            </div>

            {/* Individual reviews */}
            {data.reviews?.length === 0 ? (
              <p className="text-muted text-center py-3">No reviews yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {data.reviews.map((r, i) => (
                  <div key={i} className="p-3 rounded-3 border">
                    <div className="d-flex justify-content-between mb-1">
                      <strong>{r.customerName || "Customer"}</strong>
                      <StarRating value={r.rating} size={14} />
                    </div>
                    {r.review && <p className="mb-0 text-muted" style={{ fontSize: 14 }}>{r.review}</p>}
                    <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ── Contractor Card ─────────────────────────────────────────────────── */
const ContractorCard = ({ c, onViewReviews }) => {
  const pic = c.profilePic
    ? `${API_BASE_URL}${c.profilePic}`
    : null;

  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div
        className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
        style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      >
        {/* Colored header strip */}
        <div style={{ height: 6, background: "linear-gradient(90deg,#253863,#fbbf24)" }} />

        <div className="card-body d-flex flex-column gap-2 p-4">
          {/* Avatar + Name */}
          <div className="d-flex align-items-center gap-3">
            {pic ? (
              <img
                src={pic}
                alt={c.name}
                className="rounded-circle object-fit-cover border"
                style={{ width: 64, height: 64, borderColor: "#e5e7eb !important" }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 64, height: 64, fontSize: 24, background: "#253863" }}
              >
                {c.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <h6 className="fw-bold mb-0">{c.name}</h6>
              <small className="text-muted text-capitalize">{c.gender || ""}</small>
            </div>
          </div>

          {/* Rating */}
          <div className="d-flex align-items-center gap-2">
            <StarRating value={c.rating || 0} size={15} />
            <span className="fw-semibold" style={{ color: "#f59e0b" }}>
              {c.rating ? c.rating.toFixed(1) : "New"}
            </span>
            <small className="text-muted">({(c.reviews || []).length} reviews)</small>
          </div>

          {/* Location */}
          {c.city && (
            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: 13 }}>
              <MapPin size={13} /> {c.city}
            </div>
          )}

          {/* Experience */}
          {c.experience && (
            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: 13 }}>
              <Briefcase size={13} /> {c.experience} experience
            </div>
          )}

          {/* Specialties */}
          {c.specialties?.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-1">
              {c.specialties.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className="badge rounded-pill"
                  style={{ background: "#eff6ff", color: "#1d4ed8", fontWeight: 500, fontSize: 11 }}
                >
                  {s}
                </span>
              ))}
              {c.specialties.length > 4 && (
                <span className="badge rounded-pill bg-light text-muted" style={{ fontSize: 11 }}>
                  +{c.specialties.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Certifications badge */}
          {c.certifications?.length > 0 && (
            <div className="d-flex align-items-center gap-1" style={{ fontSize: 12, color: "#16a34a" }}>
              <Award size={12} /> {c.certifications.length} Certification{c.certifications.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Footer button */}
        <div className="card-footer bg-white border-0 px-4 pb-4 pt-0">
          <button
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill"
            style={{ background: "#253863", color: "#fff", fontSize: 13, fontWeight: 600 }}
            onClick={() => onViewReviews(c)}
          >
            <MessageSquare size={14} />
            View Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────────────────────── */
export const ContractorDirectory = () => {
  const [contractors, setContractors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedContractor, setSelectedContractor] = useState(null);

  useEffect(() => {
    fetch("/contractor/list")
      .then((r) => r.json())
      .then((d) => {
        const list = d.list || [];
        setContractors(list);
        setFiltered(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Search + Sort */
  useEffect(() => {
    let result = [...contractors];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q) ||
          c.specialties?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (sortBy === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "reviews") result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    setFiltered(result);
  }, [search, sortBy, contractors]);

  return (
    <div className="container-fluid py-4 px-4">
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: "#253863" }}>Browse Contractors</h3>
        <p className="text-muted mb-0">Find and review approved contractors for your projects.</p>
      </div>

      {/* Toolbar */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name, city, or specialty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-5 d-flex align-items-center gap-2">
          <Filter size={15} className="text-muted" />
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort: Highest Rated</option>
            <option value="reviews">Sort: Most Reviews</option>
            <option value="name">Sort: Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Stats badge */}
      {!loading && (
        <p className="text-muted mb-3" style={{ fontSize: 13 }}>
          Showing <strong>{filtered.length}</strong> of <strong>{contractors.length}</strong> contractors
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" style={{ width: 48, height: 48 }} />
          <p className="text-muted mt-3">Loading contractors…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: 48 }}>👷</div>
          <h5 className="mt-3 text-muted">No contractors found</h5>
          <p className="text-muted">Try a different search term.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="row">
          {filtered.map((c) => (
            <ContractorCard key={c._id} c={c} onViewReviews={setSelectedContractor} />
          ))}
        </div>
      )}

      {/* Reviews Modal */}
      {selectedContractor && (
        <ReviewsModal
          contractor={selectedContractor}
          onClose={() => setSelectedContractor(null)}
        />
      )}
    </div>
  );
};
