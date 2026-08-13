import { useState, useEffect } from "react";
import {
  MdPersonAdd,
  MdSearch,
  MdEmail,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import {
  approveInvitation,
  getAdminInvitations,
  getMemberInvitations,
} from "../../../services/inviteService/InviteService";
import { useBackdrop } from "../../CommonBackdrop/BackdropContext";
import InviteModal from "../../InviteModal/InviteModal";
import "../ProfilePage/ProfilePage.css";

const Invitations = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("admin");

  const [adminInvitations, setAdminInvitations] = useState([]);
  const [memberInvitations, setMemberInvitations] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const { showBackdrop, hideBackdrop } = useBackdrop();

  // ── Fetch admin invitations ───────────────────────────────────────────────
  const fetchAdminInvitations = () => {
    setIsLoading(true);
    setError(null);
    getAdminInvitations()
      .then((res) => {
        const list = res?.data?.data || res?.data || [];
        setAdminInvitations(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to fetch admin invitations:", err);
        setError("Failed to load admin invitations.");
      })
      .finally(() => setIsLoading(false));
  };

  // ── Fetch member invitations ──────────────────────────────────────────────
  const fetchMemberInvitations = () => {
    setIsLoading(true);
    setError(null);
    getMemberInvitations()
      .then((res) => {
        const list = res?.data?.data || res?.data || [];
        setMemberInvitations(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to fetch member invitations:", err);
        setError("Failed to load member invitations.");
      })
      .finally(() => setIsLoading(false));
  };

  // ── Load both on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminInvitations();
    fetchMemberInvitations();
  }, []);

  // ── Approve ───────────────────────────────────────────────────────────────
  const handleApprove = (invitationId) => {
    showBackdrop("Approving Invitation");
    approveInvitation(invitationId)
      .then(() => {
        fetchAdminInvitations();
        fetchMemberInvitations();
      })
      .catch((err) => console.error("Approve failed:", err))
      .finally(() => hideBackdrop());
  };

  const handleReject = (invitationId) => {
    console.log("Reject invitation:", invitationId);
  };

  // ── Derived list based on active tab + search ─────────────────────────────
  const sourceList = activeTab === "admin" ? adminInvitations : memberInvitations;

  const filteredList = sourceList.filter((inv) => {
    const email = (inv.inviteTo || "").toLowerCase();
    const code = (inv.invitationCode || "").toLowerCase();
    const q = search.toLowerCase();
    return email.includes(q) || code.includes(q);
  });

  // ── Tab switch handler ────────────────────────────────────────────────────
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setError(null);
  };

  // ── Shared table row renderer ─────────────────────────────────────────────
  const renderRows = () => {
    if (filteredList.length === 0) {
      return (
        <tr>
          <td
            colSpan="7"
            style={{ textAlign: "center", padding: "40px", color: "#888" }}
          >
            No {activeTab === "admin" ? "admin" : "member"} invitations found
            {search ? " matching your search" : ""}.
          </td>
        </tr>
      );
    }

    return filteredList.map((inv, idx) => {
      const email = inv.inviteTo || "N/A";
      const name = inv.name || "";
      const code = inv.invitationCode || "N/A";
      const invDate = inv.invitationDate
        ? new Date(inv.invitationDate).toLocaleDateString()
        : "-";
      const expDate = inv.expiryDate
        ? new Date(inv.expiryDate).toLocaleDateString()
        : "-";
      const appDate = inv.approvedDate
        ? new Date(inv.approvedDate).toLocaleDateString()
        : "-";

      const invitedBy = inv.invitedByAdmin
        ? `Admin: ${inv.invitedByAdmin}`
        : inv.invitedByMember
          ? `Member: ${inv.invitedByMember}`
          : "System";

      const keyId = inv.invitationID || idx;

      let statusText = "Pending";
      let statusBg = "#fef3c7";
      let statusColor = "#b45309";
      if (inv.isInvitationApproved === true) {
        statusText = "Accepted";
        statusBg = "#dcfce7";
        statusColor = "#15803d";
      } else if (inv.isInvitationApproved === false) {
        statusText = "Rejected";
        statusBg = "#fee2e2";
        statusColor = "#b91c1c";
      }

      return (
        <tr key={keyId}>
          <td>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontWeight: 600 }}>#{inv.invitationID}</span>
              <span style={{ fontSize: "0.85em", color: "#666" }}>
                {inv.invitationType}
              </span>
            </div>
          </td>
          <td style={{ fontWeight: 500 }}>{code}</td>
          <td style={{ color: "#374151" }}>{invitedBy}</td>
          <td>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontWeight: 500, color: "#333" }}>{name}</span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#666",
                  fontSize: "0.85em",
                }}
              >
                <MdEmail />
                <span>{email}</span>
              </div>
            </div>
          </td>
          <td>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                fontSize: "0.85em",
                color: "#666",
              }}
            >
              <span><strong>Issued:</strong> {invDate}</span>
              <span><strong>Expires:</strong> {expDate}</span>
              {appDate !== "-" && (
                <span><strong>Approved:</strong> {appDate}</span>
              )}
            </div>
          </td>
          <td>
            <span
              className="ap-badge"
              style={{ backgroundColor: statusBg, color: statusColor }}
            >
              {statusText}
            </span>
          </td>
          <td className="ap-table-actions">
            <div className="ap-action-group">
              {inv.isInvitationApproved === null && (
                <>
                  <button
                    className="ap-icon-btn"
                    style={{ color: "#15803d" }}
                    title="Approve"
                    onClick={() => handleApprove(inv.invitationID)}
                  >
                    <MdCheckCircle size={18} />
                  </button>
                  <button
                    className="ap-icon-btn ap-icon-btn--danger"
                    title="Reject"
                    onClick={() => handleReject(inv.invitationID)}
                  >
                    <MdCancel size={18} />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="ap-page" data-lenis-prevent="true">
      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Invitations</h1>
          <p className="ap-page-subtitle">
            Manage private access invitation codes and statuses.
          </p>
        </div>
        <button
          className="ap-btn ap-btn--primary"
          onClick={() => setShowInviteModal(true)}
        >
          <MdPersonAdd size={16} /> Generate Invite
        </button>
      </div>

      {/* Toolbar: tabs + search */}
      <div className="ap-toolbar">
        <div className="ap-filter-group">
          <button
            className={`ap-filter-btn${activeTab === "admin" ? " ap-filter-btn--active" : ""}`}
            onClick={() => handleTabChange("admin")}
          >
            Admin Invitations
          </button>
          <button
            className={`ap-filter-btn${activeTab === "member" ? " ap-filter-btn--active" : ""}`}
            onClick={() => handleTabChange("member")}
          >
            Member Invitations
          </button>
        </div>

        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search by email or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-card">
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
            Loading invitations...
          </div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#b91c1c" }}>
            {error}
          </div>
        ) : (
          <table className="ap-table">
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "#fafafa",
              }}
            >
              <tr>
                {[
                  "ID & Type",
                  "Invitation Code",
                  "Invited By",
                  "Recipient Details",
                  "Dates",
                  "Is Approved?",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </table>
        )}
      </div>

      <InviteModal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccessCallback={() => {
          fetchAdminInvitations();
          fetchMemberInvitations();
        }}
      />
    </div>
  );
};

export default Invitations;
