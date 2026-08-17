import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AddAddress,
  GetAddress,
  GetPreferences,
} from "../../../services/getUserData/GetUserData";
import { useUser } from "../../../services/showUserInfo/ShowUserInfo";
import InviteModal from "../../InviteModal/InviteModal";
import AddDocuments from "./AddDocuments";
import AddPreferencesModal from "./AddPreferences";
import "./ProfilePage.css";

// ── Helpers ──────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const dummyAddresses = [
  {
    id: 1,
    address: "15, Avenue des Champs-Élysées",
    city: "Paris",
    postalCode: "75008",
    country: "FRANCE",
    type: "Primary Delivery",
  },
  {
    id: 2,
    address: "742 Evergreen Terrace",
    city: "Beverly Hills",
    postalCode: "90210",
    country: "UNITED STATES",
    type: "Secondary Residence",
  },
];

const dummyDocuments = [
  {
    id: 1,
    name: "Passport_Copy.pdf",
    type: "Identification",
    date: "Jul 14, 2026",
    status: "Verified",
  },
  {
    id: 2,
    name: "Proof_of_Address_Utility.pdf",
    type: "Utility Bill",
    date: "Jul 15, 2026",
    status: "Pending Review",
  },
];

const dummyFamilyOffice = [
  {
    id: 1,
    name: "Jean-Luc Valentine",
    role: "Wealth Manager",
    email: "jeanluc@valentine-holdings.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Audrey Valentine",
    role: "Spouse / Beneficiary",
    email: "audrey@valentin.com",
    status: "Authorized",
  },
];

const dummyKYC = [
  {
    id: 1,
    step: "Identity Verification (Passport)",
    status: "Approved",
    verifiedAt: "Jun 01, 2026",
  },
  {
    id: 2,
    step: "Proof of Address (Utility Bill)",
    status: "Pending Approval",
    verifiedAt: "—",
  },
  {
    id: 3,
    step: "Source of Wealth Declaration",
    status: "Required",
    verifiedAt: "—",
  },
];

const dummyPreferences = [
  {
    id: 1,
    category: "Preferred Assets",
    value: "High-end Watches, Rare Whiskeys, Fine Art",
  },
  { id: 2, category: "Preferred Currency", value: "EUR (€)" },
  { id: 3, category: "Primary Language", value: "English (US), French" },
  {
    id: 4,
    category: "Notification Frequency",
    value: "Instant alerts for Watchlist",
  },
];

const dummyInvitations = [
  {
    id: 1,
    name: "Julianne Bisset",
    email: "julianne.b@example.com",
    date: "Aug 02, 2026",
    status: "Joined",
  },
  {
    id: 2,
    name: "Charles Montgomery",
    email: "charles.m@monty-corp.ch",
    date: "Aug 10, 2026",
    status: "Pending",
  },
];

const TABS = [
  "My Addresses",
  "My Documents",
  "Family Office",
  "KYC",
  "My Preferences",
  "My Invitations",
];

const StatusBadge = ({ status }) => {
  const map = {
    Approved: "Approved",
    "Pending Approval": "Pending Approval",
    Required: "Required",
    Verified: "Verified",
    "Pending Review": "Pending Review",
    Active: "Active",
    Authorized: "Authorized",
    Joined: "Joined",
    Pending: "Pending",
    Expired: "Expired",
    "Pending Verification": "Pending Verification",
  };

  let className = "prof-badge";
  if (
    ["Approved", "Verified", "Active", "Authorized", "Joined"].includes(status)
  ) {
    className += " prof-badge--leading";
  } else if (
    [
      "Pending Approval",
      "Pending Review",
      "Pending",
      "Pending Verification",
    ].includes(status)
  ) {
    className += " prof-badge--won";
  } else if (["Required", "Expired"].includes(status)) {
    className += " prof-badge--outbid";
  } else {
    className += " prof-badge--expired";
  }

  return <span className={className}>{map[status] || status}</span>;
};

// ── Component ────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("My Addresses");

  const [addresses, setAddresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [familyOffice, setFamilyOffice] = useState([]);
  const [kycList, setKycList] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [rawPreferences, setRawPreferences] = useState(null);
  const [invitations, setInvitations] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [member, setMember] = useState({
    name: "",
    memberId: "",
    tier: "OBSIDIAN",
    since: "",
    avatar: null,
    email: "",
    location: "",
    totalBids: 0,
    activeBids: 0,
    wonAuctions: 0,
    portfolioValue: "—",
  });

  const { userInfo } = useUser();

  const initials = getInitials(member.name);

  // Invite states
  const [showInviteModal, setShowInviteModal] = useState(false);

  const openAddModal = (type) => {
    setModalType(type);
    setIsAddModalOpen(true);
  };

  const formatPreferencesData = (prefObj) => {
    if (!prefObj) return [];

    const assets = [];
    if (prefObj.InterestedInWatches) assets.push("Watches");
    if (prefObj.InterestedInWhisky) assets.push("Whisky");
    if (prefObj.InterestedInCigars) assets.push("Cigars");
    if (prefObj.InterestedInLuxuryPens) assets.push("Luxury Pens");
    if (prefObj.InterestedInYachts) assets.push("Yachts");

    const alerts = [];
    if (prefObj.Newsletter) alerts.push("Newsletter");
    if (prefObj.SMSAlerts) alerts.push("SMS Alerts");
    if (prefObj.EmailAlerts) alerts.push("Email Alerts");

    const list = [];
    if (assets.length > 0) {
      list.push({ id: 1, category: "Preferred Assets", value: assets.join(", ") });
    }
    if (prefObj.PreferredCurrency) {
      list.push({ id: 2, category: "Preferred Currency", value: prefObj.PreferredCurrency });
    }
    if (prefObj.PreferredLanguage) {
      list.push({ id: 3, category: "Primary Language", value: prefObj.PreferredLanguage });
    }
    if (alerts.length > 0) {
      list.push({ id: 4, category: "Active Alerts", value: alerts.join(", ") });
    }
    return list;
  };

  const GetAddressDetails = () => {
    GetAddress()
      .then((res) => {
        setAddresses(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
        // throw err;
      });
  };

  const fetchUserPreferences = () => {
    GetPreferences()
      .then((res) => {
        if (res?.data?.data) {
          const prefData = res.data.data;
          setRawPreferences(prefData);
          setPreferences(formatPreferencesData(prefData));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetAddressDetails();
    // fetchUserPreferences();
  }, []);

  const [newAddress, setNewAddress] = useState({
    AddressType: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    StateProvince: "",
    Country: "",
    PostalCode: "",
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();

    AddAddress(newAddress)
      .then((res) => {
        console.log(res);
        if (res?.data?.status === 200) {
          console.log("Address added successfully");
          setIsAddModalOpen(false);
          GetAddressDetails();
          console.log("function finished");
        }
      })
      .catch((err) => {
        console.log(err);
        // throw err;
      });
  };

  return (
    <div className="prof-page">
      {/* Background */}
      <div className="prof-bg" />

      <div className="prof-container">
        {/* ── Hero Banner ───────────────────────────── */}
        <div className="prof-hero">
          <div className="prof-hero__left">
            <div className="prof-avatar">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} />
              ) : (
                <span className="prof-avatar__initials">
                  {userInfo?.firstName?.charAt(0) +
                    userInfo?.lastName?.charAt(0)}
                </span>
              )}
              <span className="prof-avatar__status" title="Online" />
            </div>
            <div className="prof-hero__info">
              <div className="prof-hero__tier">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {member.tier} MEMBER · SINCE {member.since}
              </div>
              <h1 className="prof-hero__name">
                {userInfo?.firstName + " " + userInfo?.lastName}
              </h1>
              <p className="prof-hero__id">{userInfo?.email}</p>
            </div>
          </div>
          <div className="prof-hero__actions">
            <button
              className="prof-btn prof-btn--ghost"
              onClick={() => setShowInviteModal(true)}
            >
              Invite a Friend
            </button>
            {userInfo?.role === "SuperAdmin" && (
              <button
                className="prof-btn prof-btn--ghost"
                onClick={() => navigate("/admin")}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────── */}
        <div className="prof-stats">
          {[
            { label: "TOTAL BIDS", value: member.totalBids },
            { label: "ACTIVE BIDS", value: member.activeBids },
            { label: "AUCTIONS WON", value: member.wonAuctions },
            { label: "PORTFOLIO VALUE", value: member.portfolioValue },
          ].map((s) => (
            <div className="prof-stat" key={s.label}>
              <span className="prof-stat__value">{s.value}</span>
              <span className="prof-stat__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Main Layout ───────────────────────────── */}
        <div className="prof-layout">
          {/* Tabs + Content */}
          <div className="prof-main">
            <div className="prof-tabs" style={{ flexWrap: "wrap" }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`prof-tab${activeTab === tab ? " prof-tab--active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* My Addresses */}
            {activeTab === "My Addresses" && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>Registered Addresses ({addresses.length})</span>
                  <button
                    onClick={() => openAddModal("address")}
                    className="prof-btn prof-btn--gold"
                    style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                  >
                    + Add Address
                  </button>
                </div>
                {addresses.length > 0 ? (
                  <>
                    {addresses?.map((addr) => (
                      <div className="prof-listing-row" key={addr.id}>
                        <div className="prof-listing-dot" data-status="live" />
                        <div className="prof-listing-info">
                          <p className="prof-listing-title">
                            {addr.addressLine1}, {addr.addressLine2}
                          </p>
                          <p className="prof-listing-date">
                            {addr.city}, {addr.stateProvince}, {addr.postalCode}{" "}
                            · {addr.country}
                          </p>
                        </div>
                        <div className="prof-listing-right">
                          <span className="prof-listing-status live">
                            {addr.addressType}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="prof-listing-row">
                    <div className="prof-listing-dot" data-status="live" />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">No addresses found</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Documents */}
            {activeTab === "My Documents" && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>Vault Documents ({documents.length})</span>
                  <button
                    onClick={() => openAddModal("document")}
                    className="prof-btn prof-btn--gold"
                    style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                  >
                    + Add Document
                  </button>
                </div>
                {documents?.length > 0 ? (
                  documents.map((doc) => (
                    <div className="prof-listing-row" key={doc.id}>
                      <div
                        className="prof-listing-dot"
                        data-status={
                          doc.status === "Verified" ? "live" : "review"
                        }
                      />
                      <div className="prof-listing-info">
                        <p className="prof-listing-title">{doc.name}</p>
                        <p className="prof-listing-date">
                          {doc.type} · Uploaded {doc.date}
                        </p>
                      </div>
                      <div className="prof-listing-right">
                        <StatusBadge status={doc.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="prof-listing-row">
                    <div className="prof-listing-dot" data-status="live" />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">No documents added</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Family Office */}
            {activeTab === "Family Office" && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>Authorized Members ({familyOffice.length})</span>
                  <button
                    onClick={() => openAddModal("family")}
                    className="prof-btn prof-btn--gold"
                    style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                  >
                    + Add Member
                  </button>
                </div>
                {familyOffice?.length > 0 ? (
                  familyOffice.map((fam) => (
                    <div className="prof-listing-row" key={fam.id}>
                      <div className="prof-listing-dot" data-status="live" />
                      <div className="prof-listing-info">
                        <p className="prof-listing-title">{fam.name}</p>
                        <p className="prof-listing-date">
                          {fam.role} · {fam.email}
                        </p>
                      </div>
                      <div className="prof-listing-right">
                        <StatusBadge status={fam.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="prof-listing-row">
                    <div className="prof-listing-dot" data-status="live" />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">No members added</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* KYC */}
            {activeTab === "KYC" && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>KYC Compliance Checks ({kycList.length})</span>
                  <button
                    onClick={() => openAddModal("kyc")}
                    className="prof-btn prof-btn--gold"
                    style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                  >
                    + Add KYC Requirement
                  </button>
                </div>
                {kycList?.length > 0 ? (
                  kycList.map((kyc) => (
                    <div className="prof-listing-row" key={kyc.id}>
                      <div
                        className="prof-listing-dot"
                        data-status={
                          kyc.status === "Approved" ? "live" : "review"
                        }
                      />
                      <div className="prof-listing-info">
                        <p className="prof-listing-title">{kyc.step}</p>
                        <p className="prof-listing-date">
                          Verified: {kyc.verifiedAt}
                        </p>
                      </div>
                      <div className="prof-listing-right">
                        <StatusBadge status={kyc.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="prof-listing-row">
                    <div className="prof-listing-dot" data-status="live" />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">No KYC records found</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Preferences */}
            {activeTab === "My Preferences" && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>Membership Preferences ({preferences.length})</span>
                  <button
                    onClick={() => openAddModal("preference")}
                    className="prof-btn prof-btn--gold"
                    style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                  >
                    + Add Preference
                  </button>
                </div>
                {preferences?.length > 0 ? (
                  preferences.map((pref) => (
                    <div className="prof-listing-row" key={pref.id}>
                      <div className="prof-listing-dot" data-status="live" />
                      <div className="prof-listing-info">
                        <p className="prof-listing-title">{pref.category}</p>
                        <p className="prof-listing-date">{pref.value}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="prof-listing-row">
                    <div className="prof-listing-dot" data-status="live" />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">No Preferences added</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Invitations */}
            {activeTab === "My Invitations" && (
              <div className="prof-panel">
                <div className="prof-listings-header">
                  <span>Sent Invitations ({invitations.length})</span>
                  <button
                    onClick={() => openAddModal("invitation")}
                    className="prof-btn prof-btn--gold"
                    style={{ padding: "8px 20px", fontSize: "0.7rem" }}
                  >
                    + Invite Friend
                  </button>
                </div>
                {invitations?.length > 0 ? (
                  invitations.map((invite) => (
                    <div className="prof-listing-row" key={invite.id}>
                      <div
                        className="prof-listing-dot"
                        data-status={
                          invite.status === "Joined" ? "live" : "review"
                        }
                      />
                      <div className="prof-listing-info">
                        <p className="prof-listing-title">{invite.name}</p>
                        <p className="prof-listing-date">
                          {invite.email} · Invited on {invite.date}
                        </p>
                      </div>
                      <div className="prof-listing-right">
                        <StatusBadge status={invite.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="prof-listing-row">
                    <div className="prof-listing-dot" data-status="live" />
                    <div className="prof-listing-info">
                      <p className="prof-listing-title">No invitations sent</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────── */}
          <aside className="prof-sidebar">
            {/* Membership Card */}
            <div className="prof-member-card">
              <div className="prof-member-card__top">
                <span className="prof-member-card__eyebrow">OPLUENZA</span>
                <span className="prof-member-card__tier">{member.tier}</span>
              </div>
              <div className="prof-member-card__id">{member.memberId}</div>
              <div className="prof-member-card__name">
                {userInfo?.firstName + " " + userInfo?.lastName}
              </div>
              <div className="prof-member-card__since">
                Member since {member.since}
              </div>
              <div className="prof-member-card__shine" />
            </div>

            {/* Quick Links */}
            <div className="prof-sidebar-box">
              <p className="prof-sidebar-box__title">Quick Links</p>
              <div className="prof-quick-links">
                {[
                  { label: "Browse Watches", path: "/watchListing" },
                  { label: "Browse Whisky", path: "/whiskyListings" },
                  { label: "Concierge", path: "/concierge" },
                  { label: "Sell an Asset", path: "/sell" },
                ].map((l) => (
                  <Link key={l.label} to={l.path} className="prof-quick-link">
                    {l.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Add Data Modal ────────────────────────────── */}
      {isAddModalOpen && modalType === "address" && (
        <div className="prof-modal-overlay">
          <div
            className="prof-modal-card"
            style={{ maxWidth: "640px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="prof-modal-close"
              onClick={() => setIsAddModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3
              className="prof-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--gold)",
                marginBottom: "1.5rem",
                fontSize: "1.4rem",
              }}
            >
              Add New Address
            </h3>

            <form onSubmit={handleAddSubmit} className="prof-settings-form">
              <div className="prof-settings-grid">
                <div className="prof-settings-field">
                  <label>Address Type</label>
                  <select
                    name="AddressType"
                    required
                    value={newAddress.AddressType}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        AddressType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Address Type</option>
                    <option value="Personal Address">Personal Address</option>
                    <option value="Office Address">Office Address</option>
                    <option value="Family Office Address">
                      Family Office Address
                    </option>
                    <option value="Corporate Address">Corporate Address</option>
                    <option value="Billing Address">Billing Address</option>
                    <option value="Shipping Address">Shipping Address</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="prof-settings-field">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    name="AddressLine1"
                    value={newAddress.AddressLine1}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        AddressLine1: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g. 10 Marina Boulevard"
                  />
                </div>
                <div className="prof-settings-field">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="AddressLine2"
                    placeholder="e.g. Apt 2B"
                    value={newAddress.AddressLine2}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        AddressLine2: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="prof-settings-field">
                  <label>City</label>
                  <input
                    type="text"
                    name="City"
                    required
                    placeholder="e.g. Singapore"
                    value={newAddress.City}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, City: e.target.value })
                    }
                  />
                </div>
                <div className="prof-settings-field">
                  <label>State / Province</label>
                  <input
                    type="text"
                    name="StateProvince"
                    required
                    placeholder="e.g. Test state"
                    value={newAddress.StateProvince}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        StateProvince: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="prof-settings-field">
                  <label>Country</label>
                  <input
                    type="text"
                    name="Country"
                    required
                    placeholder="e.g. Test Country"
                    value={newAddress.Country}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, Country: e.target.value })
                    }
                  />
                </div>
                <div
                  className="prof-settings-field"
                  style={{ gridColumn: "span 2" }}
                >
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="PostalCode"
                    required
                    placeholder="e.g. 23456"
                    value={newAddress.PostalCode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        PostalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="prof-btn prof-btn--gold"
                style={{ marginTop: "1.5rem", width: "100%" }}
              >
                Confirm & Add
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Document Modal ────────────────────────── */}
      <AddDocuments
        show={isAddModalOpen && modalType === "document"}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(data) => {
          console.log("Document successfully added:", data);
        }}
      />

      {/* ── Add Preference Modal ────────────────────────── */}
      <AddPreferencesModal
        show={isAddModalOpen && modalType === "preference"}
        onClose={() => setIsAddModalOpen(false)}
        initialData={rawPreferences}
        onSuccess={(data, payload) => {
          console.log("Preferences successfully updated:", payload);
          const updatedObj = data?.data || payload;
          setRawPreferences(updatedObj);
          setPreferences(formatPreferencesData(updatedObj));
        }}
      />

      {/* ── Invite a Friend Modal ────────────────────────────── */}
      <InviteModal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
};

export default ProfilePage;
