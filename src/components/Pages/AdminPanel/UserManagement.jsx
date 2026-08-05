import { useEffect, useMemo, useState } from "react";
import { MdPersonAdd, MdSearch, MdPeopleOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { userData } from "../../../services/getUserData/GetUserData";
import { VerifyUser } from "../../../services/approveUser/ApproveUser";
import { useBackdrop } from "../../CommonBackdrop/BackdropContext";

const statusColor = {
  Active: { bg: "#dcfce7", color: "#15803d" },
  Suspended: { bg: "#fee2e2", color: "#b91c1c" },
  Pending: { bg: "#fef3c7", color: "#b45309" },
};

const roleColor = {
  Buyer: { bg: "#eff6ff", color: "#1d4ed8" },
  Seller: { bg: "#faf5ff", color: "#7e22ce" },
};

const statCards = [
  {
    label: "Total Members",
    value: "12,842",
    sub: "+218 this month",
    color: "#3b5bdb",
  },
  {
    label: "Active Users",
    value: "11,406",
    sub: "88.8% of total",
    color: "#15803d",
  },
  { label: "Suspended", value: "312", sub: "2.4% of total", color: "#b91c1c" },
  {
    label: "Pending Verification",
    value: "148",
    sub: "Needs review",
    color: "#b45309",
  },
];

const COLUMN_COUNT = 22;

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [approvalList, setApprovalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showBackdrop, hideBackdrop } = useBackdrop();

  const fetchUserData = () => {
    setIsLoading(true);
    setError(null);
    userData()
      .then((res) => {
        setApprovalList(res?.data?.data ?? []);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setError("We couldn't load users. Please try again.");
        setApprovalList([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleApprove = (rowData) => {
    showBackdrop('Processing');
    VerifyUser({ MemberId: rowData.memberID })
      .then(() => fetchUserData())
      .catch((err) => console.error("Approve failed:", err))
      .finally(() => hideBackdrop());
  };

  const handleReject = (rowData) => {
    showBackdrop('Processing');
    VerifyUser({ MemberId: rowData.memberID })
      .then(() => fetchUserData())
      .catch((err) => console.error("Reject failed:", err))
      .finally(() => hideBackdrop());
  };

  const filteredList = useMemo(() => {
    const query = search.trim().toLowerCase();

    return approvalList.filter((u) => {
      const matchesStatus =
        filterStatus === "All" || u.membershipStatus === filterStatus;

      if (!matchesStatus) return false;
      if (!query) return true;

      const displayName = (
        u.displayName || `${u.firstName ?? ""} ${u.lastName ?? ""}`
      ).toLowerCase();
      const email = (u.primaryEmail || "").toLowerCase();

      return displayName.includes(query) || email.includes(query);
    });
  }, [approvalList, search, filterStatus]);

  const getInitials = (u) => {
    const first = u.firstName?.[0] ?? "";
    const last = u.lastName?.[0] ?? "";
    return (first + last).toUpperCase() || "?";
  };

  return (
    <div className="ap-page">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">User Management</h1>
          <p className="ap-page-subtitle">
            Manage registered members, roles, and account statuses.
          </p>
        </div>
        <button className="ap-btn ap-btn--primary">
          <MdPersonAdd size={16} /> Invite User
        </button>
      </div>

      <div className="ap-stat-row">
        {statCards.map((s) => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>
              {s.value}
            </span>
            <span className="ap-mini-stat__sub">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ap-filter-group">
          {["All", "Active", "Suspended", "Pending"].map((s) => (
            <button
              key={s}
              className={`ap-filter-btn ${filterStatus === s ? "ap-filter-btn--active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Member Id</th>
              <th>Member No.</th>
              <th>Membership Type</th>
              <th>Membership Status</th>
              <th>Title</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Display Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Primary Email</th>
              <th>Secondary Email</th>
              <th>Primary Mobile</th>
              <th>Secondary Mobile</th>
              <th>Family Office Name</th>
              <th>Occupation</th>
              <th>Company Name</th>
              <th>Website</th>
              <th>Bio</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  <div style={emptyStateStyle}>
                    <div style={spinnerStyle} />
                    <p style={emptyStateTextStyle}>Loading users…</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  <div style={emptyStateStyle}>
                    <p style={{ ...emptyStateTextStyle, color: "#b91c1c" }}>
                      {error}
                    </p>
                    <button
                      className="ap-btn ap-btn--primary"
                      onClick={fetchUserData}
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredList.length > 0 ? (
              filteredList.map((u, idx) => (
                <tr key={u.memberID ?? idx}>
                  <td>
                    <div className="ap-user-cell">
                      <div className="ap-avatar">{getInitials(u)}</div>
                    </div>
                  </td>
                  <td className="ap-table__muted">{u.memberID}</td>
                  <td className="ap-table__muted">{u.memberNo}</td>
                  <td>
                    <span
                      className="ap-badge"
                      style={roleColor[u.membershipType] ?? {}}
                    >
                      {u.membershipType}
                    </span>
                  </td>
                  <td>
                    <span
                      className="ap-badge"
                      style={statusColor[u.membershipStatus] ?? {}}
                    >
                      {u.membershipStatus}
                    </span>
                  </td>
                  <td className="ap-table__value">{u.title}</td>
                  <td className="ap-table__value">{u.firstName}</td>
                  <td className="ap-table__value">{u.middleName}</td>
                  <td className="ap-table__value">{u.lastName}</td>
                  <td className="ap-table__value">{u.displayName}</td>
                  <td className="ap-table__value">{u.dateOfBirth}</td>
                  <td className="ap-table__value">{u.gender}</td>
                  <td className="ap-table__value">{u.primaryEmail}</td>
                  <td className="ap-table__value">{u.secondaryEmail}</td>
                  <td className="ap-table__value">{u.primaryMobile}</td>
                  <td className="ap-table__value">{u.secondaryMobile}</td>
                  <td className="ap-table__value">{u.familyOfficeName}</td>
                  <td className="ap-table__value">{u.occupation}</td>
                  <td className="ap-table__value">{u.companyName}</td>
                  <td className="ap-table__value">{u.website}</td>
                  <td className="ap-table__value">{u.bio}</td>
                  <td className="ap-table__value">{u.createdOn}</td>
                  <td>
                    <div className="ap-action-group">
                      <button
                        onClick={() => handleApprove(u)}
                        className="ap-icon-btn cursor-pointer"
                        title="Approve"
                      >
                        <FaCheckCircle size={15} />
                      </button>
                      <button
                        onClick={() => handleReject(u)}
                        className="ap-icon-btn cursor-pointer ap-icon-btn--danger"
                        title="Reject"
                      >
                        <RiCloseCircleFill size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  <div style={emptyStateStyle}>
                    <MdPeopleOutline size={32} color="#9ca3af" />
                    <p style={emptyStateTextStyle}>
                      {approvalList.length === 0
                        ? "No users found."
                        : "No users match your search or filter."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const emptyStateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "48px 16px",
  width: "100%",
  textAlign: "center",
};

const emptyStateTextStyle = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
};

const spinnerStyle = {
  width: "24px",
  height: "24px",
  border: "3px solid #e5e7eb",
  borderTopColor: "#3b5bdb",
  borderRadius: "50%",
  animation: "ap-spin 0.8s linear infinite",
};

export default UserManagement;
