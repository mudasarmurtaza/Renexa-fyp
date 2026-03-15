import { Search, Bell, User, Menu } from "lucide-react";

export const CustomerHeader = ({ setShowSidebar }) => {
  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
      {/* Mobile toggle button */}
      <button
        className="btn d-lg-none"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        <Menu size={22} />
      </button>

      <h5 className="mb-0 ms-3 fw-semibold d-none d-lg-block">Dashboard</h5>

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative">
          <Search
            size={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="search"
            style={{ width: "250px" }}
          />
        </div>
        <Bell size={20} className="text-muted cursor-pointer" />
        <User size={22} className="text-muted cursor-pointer" />
      </div>
    </header>
  );
};
