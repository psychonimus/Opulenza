import { useState, useEffect } from "react";
import { MdPersonAdd, MdSearch, MdEmail, MdCheckCircle, MdCancel } from "react-icons/md";
import { getInvitationApprovalList, approveInvitation } from "../../../services/inviteService/InviteService";
import { useBackdrop } from "../../CommonBackdrop/BackdropContext";
import InviteModal from "../../InviteModal/InviteModal";
import "../ProfilePage/ProfilePage.css";

const Invitations = () => {
  const [search, setSearch] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Shared Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { showBackdrop, hideBackdrop } = useBackdrop();

  const fetchInvitations = () => {
    setIsLoading(true);
    setError(null);
    getInvitationApprovalList()
      .then((res) => {
        const list = res?.data?.data || res?.data || res || [];
        setInvitations(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to fetch invitations:", err);
        setError("Failed to load invitations.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleApprove = (invitationId) => {
    showBackdrop("Approving Invitation");
    approveInvitation(invitationId)
      .then(() => fetchInvitations())
      .catch((err) => console.error("Approve failed:", err))
      .finally(() => hideBackdrop());
  };

  const handleReject = (invitationId) => {
    console.log("Reject invitation:", invitationId);
  };



  const filteredList = invitations.filter(inv => {
    const email = inv.inviteTo || "";
    const code = inv.invitationCode || "";

    const matchesSearch = email.toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });



  return (
    <div className="ap-page" data-lenis-prevent="true">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Invitations</h1>
          <p className="ap-page-subtitle">
            Manage private access invitation codes and statuses.
          </p>
        </div>
        <button className="ap-btn ap-btn--primary" onClick={() => setShowInviteModal(true)}>
          <MdPersonAdd size={16} /> Generate Invite
        </button>
      </div>



      <div className="ap-toolbar">
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

      <div className="ap-table-card">
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>Loading invitations...</div>
        ) : error ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#b91c1c" }}>{error}</div>
        ) : (
          <table className="ap-table">
            <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>
              <tr>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>ID & Type</th>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>Invitation Code</th>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>Invited By</th>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>Recipient Details</th>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>Dates</th>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }}>Is Approved?</th>
                <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#fafafa" }} className="ap-table-actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((inv, idx) => {
                const email = inv.inviteTo || "N/A";
                const name = inv.name || "";
                const code = inv.invitationCode || "N/A";
                const invDate = inv.invitationDate ? new Date(inv.invitationDate).toLocaleDateString() : "-";
                const expDate = inv.expiryDate ? new Date(inv.expiryDate).toLocaleDateString() : "-";
                const appDate = inv.approvedDate ? new Date(inv.approvedDate).toLocaleDateString() : "-";
                
                const invitedBy = inv.invitedByAdmin ? `Admin: ${inv.invitedByAdmin}` : (inv.invitedByMember ? `Member: ${inv.invitedByMember}` : "System");
                const keyId = inv.invitationID || idx;

                return (
                  <tr key={keyId}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 600 }}>#{inv.invitationID}</span>
                        <span style={{ fontSize: "0.85em", color: "#666" }}>{inv.invitationType}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{code}</td>
                    <td style={{ color: "#374151" }}>{invitedBy}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontWeight: 500, color: "#333" }}>{name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#666", fontSize: "0.85em" }}>
                          <MdEmail />
                          <span>{email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "0.85em", color: "#666" }}>
                        <span><strong>Issued:</strong> {invDate}</span>
                        <span><strong>Expires:</strong> {expDate}</span>
                        {appDate !== "-" && <span><strong>Approved:</strong> {appDate}</span>}
                      </div>
                    </td>
                    <td>
                      {(() => {
                        let text = "Pending";
                        let bg = "#fef3c7";
                        let color = "#b45309";
                        
                        if (inv.isInvitationApproved === true) {
                          text = "Accepted";
                          bg = "#dcfce7";
                          color = "#15803d";
                        } else if (inv.isInvitationApproved === false) {
                          text = "Rejected";
                          bg = "#fee2e2";
                          color = "#b91c1c";
                        }

                        return (
                          <span
                            className="ap-badge"
                            style={{ backgroundColor: bg, color: color }}
                          >
                            {text}
                          </span>
                        );
                      })()}
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
              })}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                    No invitations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <InviteModal 
        show={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
        onSuccessCallback={fetchInvitations} 
      />
    </div>
  );
};

export default Invitations;
