import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
// import whiskyData from "../../../../data/WhiskyData";
import { getApprovedListing } from '../../../../services/sellingServices/getSellListings/getSellListings'
import { AddBid } from '../../../../services/biddingServices/BiddingServices'
import "./Whisky.css";

const DetailedWhiskyPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [whiskyDataList, setWhiskyDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("provenance");

  // Bidding States
  const [currentBid, setCurrentBid] = useState(0);
  const [bids, setBids] = useState([]);
  const [biddersCount, setBiddersCount] = useState(10);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAutoBidding, setIsAutoBidding] = useState(false);

  // Magnifier state
  const magnifierRef = useRef(null);
  const [magnifier, setMagnifier] = useState({
    visible: false,
    x: 0,
    y: 0,
    bgX: 0,
    bgY: 0,
    wrapperW: 0,
    wrapperH: 0,
  });
  const LENS_SIZE = 160;
  const ZOOM = 2.5;

  const handleMagnifierMove = useCallback(
    (e) => {
      const wrapper = magnifierRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const bgX = -(x * ZOOM - LENS_SIZE / 2);
      const bgY = -(y * ZOOM - LENS_SIZE / 2);
      setMagnifier({
        visible: true,
        x,
        y,
        bgX,
        bgY,
        wrapperW: rect.width,
        wrapperH: rect.height,
      });
    },
    [LENS_SIZE, ZOOM],
  );

  const handleMagnifierLeave = useCallback(() => {
    setMagnifier((prev) => ({ ...prev, visible: false }));
  }, []);

  // Image gallery state
  const [mainImage, setMainImage] = useState("");
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);

  // Modal / bid state
  const [showBidModal, setShowBidModal] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState(0);
  const [bidError, setBidError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalAutoBid, setModalAutoBid] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = (endDateStr) => {
    if (!endDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const difference = +new Date(endDateStr) - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getApprovedListing(2), getApprovedListing(6)])
      .then(([whiskyRes, caskRes]) => {
        const whiskyList = whiskyRes?.data?.data || [];
        const caskList = caskRes?.data?.data || [];
        const list = [...whiskyList, ...caskList];
        setWhiskyDataList(list);
        
        const found = list.find((w) => w.itemId === Number(id));
        if (found) {
          const isCask = found.categoryId === 6 || found.categoryName?.toLowerCase() === 'cask';
          
          let mappedItem = {
            id: found.itemId,
            itemId: found.itemId,
            categoryId: found.categoryId,
            categoryName: found.categoryName,
            currency: found.currency || 'USD',
            auctionEndDate: found.auctionEndDate,
            bidIncrement: found.bidIncreament || 500,
            currentBidNumber: found.currentPrice || found.orignalPrice || found.expectedPrice || 1000,
            activeBidders: 15,
            liveActivity: [
              {
                id: 1,
                member: "MEMBER #7***3",
                timeAgo: "2 minutes ago",
                timestamp: Date.now() - 120000,
                amount: `$${found.currentPrice || found.orignalPrice || found.expectedPrice || 1000}`,
                amountNumber: found.currentPrice || found.orignalPrice || found.expectedPrice || 1000
              }
            ]
          };

          if (isCask) {
            mappedItem.title = found.details?.caskType || "Rare Cask";
            mappedItem.reference = found.details?.distillesy || "";
            mappedItem.description = `Distillery: ${found.details?.distillesy || 'N/A'} | Cask Type: ${found.details?.caskType || 'N/A'}`;
            mappedItem.detailedDescription = `This is a premium Cask Lot featuring a ${found.details?.caskType || 'cask'} from the renowned ${found.details?.distillesy || 'distillery'}. Number of bottles: ${found.details?.noOfBottles || 'N/A'}, ABV: ${found.details?.abv || 'N/A'}%.`;
            mappedItem.image = found.details?.frontLabel || "";
            mappedItem.angles = [found.details?.backLabel, found.details?.fillLevel, found.details?.originalCase].filter(Boolean);
            mappedItem.provenance = {
              title: "Cask Provenance & History",
              description: `Matured at the ${found.details?.distillesy || 'distillery'} in a ${found.details?.caskType || 'N/A'} cask. The lot includes the original sale documentation and cask registry extract.`,
              timeline: [
                { period: found.details?.ays || "N/A", detail: "Cask filled / distilled" },
                { period: "PRESENT", detail: "Opulenza Authenticated Vault Custody" }
              ]
            };
            mappedItem.authentication = `This cask has been fully authenticated. Original receipts/documents: ${found.details?.receipt ? 'Included' : 'Verified'}. Distillery check: ${found.details?.distillesy ? 'Confirmed' : 'Pending'}. Certificates: ${found.details?.certificate ? 'Included' : 'Verified by cellar masters'}.`;
            mappedItem.conditionReport = {
              label: ["CASK TYPE", "ABV", "NO. OF BOTTLES", "FILL LEVEL"],
              value: [
                found.details?.caskType || "N/A",
                found.details?.abv ? `${found.details.abv}% ABV` : "N/A",
                found.details?.noOfBottles || "N/A",
                found.details?.fillLevel ? "Pristine - Verified" : "Verified"
              ]
            };
            mappedItem.details = [
              { label: "DISTILLERY", value: found.details?.distillesy || "—" },
              { label: "DISTILLED", value: found.details?.ays || "—" },
              { label: "CASK", value: found.details?.caskType || "—" },
              { label: "RARITY", value: found.details?.noOfBottles ? `${found.details.noOfBottles} Bottles` : "—" },
            ];
          } else {
            // Whisky
            mappedItem.title = found.details?.producerName || found.categoryName || "Rare Whisky";
            mappedItem.reference = found.details?.bottlingName || "";
            mappedItem.description = `Producer: ${found.details?.producerName || 'N/A'} | Region: ${found.details?.region || 'N/A'}`;
            mappedItem.detailedDescription = `This is an exceptional bottle of ${found.details?.producerName || 'whisky'} (${found.details?.bottlingName || 'N/A'}). Matured for ${found.details?.age || 'N/A'} years, distilled in ${found.details?.vintageYear || 'N/A'}, strength is ${found.details?.proof || 'N/A'}% ABV. Region: ${found.details?.region || 'N/A'}.`;
            mappedItem.image = found.details?.frontLabel || "";
            mappedItem.angles = [found.details?.backLabel, found.details?.fillLevel, found.details?.originalCase].filter(Boolean);
            mappedItem.provenance = {
              title: "Whisky Provenance & History",
              description: `Produced by ${found.details?.producerName || 'N/A'} in the ${found.details?.region || 'N/A'} region. Stored under ${found.details?.storageCondition || 'excellent'} storage conditions.`,
              timeline: [
                { period: found.details?.vintageYear || "N/A", detail: "Distilled and casked" },
                { period: "PRESENT", detail: "Opulenza Authenticated Vault Custody" }
              ]
            };
            mappedItem.authentication = `This bottle has been fully authenticated. Producer: ${found.details?.producerName || 'N/A'}. Bottle code and front/back labels checked: ${found.details?.frontLabel ? 'Verified' : 'Yes'}.`;
            mappedItem.conditionReport = {
              label: ["VINTAGE", "AGE", "STRENGTH", "BOTTLE SIZE"],
              value: [
                found.details?.vintageYear || "N/A",
                found.details?.age ? `${found.details.age} Years` : "N/A",
                found.details?.proof ? `${found.details.proof}% ABV` : "N/A",
                found.details?.bottle || "N/A"
              ]
            };
            mappedItem.details = [
              { label: "DISTILLERY", value: found.details?.producerName || "—" },
              { label: "DISTILLED", value: found.details?.vintageYear || "—" },
              { label: "CASK", value: found.details?.productionType || "—" },
              { label: "RARITY", value: found.details?.age ? `${found.details.age} Years Aged` : "—" },
            ];
          }
          setItem(mappedItem);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (item) {
      setCurrentBid(item.currentBidNumber);
      setBids(item.liveActivity || []);
      setBiddersCount(item.activeBidders || 10);
      setMainImage(item.image);
      setActiveThumbIdx(0);
      setCustomBidAmount(item.currentBidNumber + item.bidIncrement);
      setTimeLeft(
        item.auctionEndDate
          ? calculateTimeLeft(item.auctionEndDate)
          : { days: 1, hours: 4, minutes: 18, seconds: 40 }
      );
    }
  }, [item]);

  useEffect(() => {
    if (!item || !item.auctionEndDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(item.auctionEndDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [item]);

  // Auto-bid simulation
  useEffect(() => {
    let simInterval;
    if (isAutoBidding && item) {
      simInterval = setInterval(() => {
        if (Math.random() < 0.35) {
          const increment = item.bidIncrement;
          setCurrentBid((prev) => {
            const newAmt = prev + increment;
            const newBidObj = {
              id: Date.now(),
              member: `MEMBER #${Math.floor(Math.random() * 9 + 1)}***${Math.floor(Math.random() * 9 + 1)}`,
              timeAgo: "Just now",
              timestamp: Date.now(),
              amount: formatCurrency(newAmt),
              amountNumber: newAmt,
            };
            setBids((prevList) => [newBidObj, ...prevList]);
            setBiddersCount((bc) => bc + 1);
            return newAmt;
          });
        }
      }, 7000);
    }
    return () => {
      if (simInterval) clearInterval(simInterval);
    };
  }, [isAutoBidding, item?.bidIncrement, item]);

  // Handle loading state
  if (loading) {
    return (
      <div className="whisky-not-found">
        <div className="container text-center py-5">
          <span className="ap-spin" style={{ color: "#e1af4a" }}>Loading details...</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="whisky-not-found">
        <div className="container text-center py-5">
          <h2 className="error-title">Bottle Not Found</h2>
          <p className="error-desc">
            The whisky listing you are looking for does not exist or has been
            archived.
          </p>
          <Link to="/whiskyListings" className="back-btn">
            RETURN TO LISTINGS
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const formatNum = (num) => String(num).padStart(2, "0");

  const thumbnails = [item.image, ...(item.angles || [])];

  const handlePlaceBidClick = () => {
    setCustomBidAmount(currentBid + item.bidIncrement);
    setBidError("");
    setShowBidModal(true);
  };

  const submitCustomBid = (e) => {
    e.preventDefault();
    const amt = Number(customBidAmount);
    const minRequired = currentBid + item.bidIncrement;
    if (isNaN(amt) || amt < minRequired) {
      setBidError(`Bid must be at least ${formatCurrency(minRequired)}`);
      return;
    }

    const payload = {
      ItemId: item.itemId,
      BidAmount: amt,
      Currency: item.currency
    };

    AddBid(payload)
      .then(() => {
        const newBidObj = {
          id: Date.now(),
          member: `MEMBER #YOU***${Math.floor(Math.random() * 9 + 1)}`,
          timeAgo: "Just now",
          timestamp: Date.now(),
          amount: formatCurrency(amt),
          amountNumber: amt,
        };
        setCurrentBid(amt);
        setBids((prev) => [newBidObj, ...prev]);
        setBiddersCount((prev) => prev + 1);
        setShowBidModal(false);
        setSuccessMessage(`Bid of ${formatCurrency(amt)} placed successfully!`);
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((err) => {
        console.error(err);
        setBidError(err?.response?.data?.message || err?.message || 'Failed to place bid. Please try again.');
      });
  };

  // Extract distillery and cask details from details array
  const distillery =
    item.details?.find((d) => d.label === "DISTILLERY")?.value || item.title;
  const distilled =
    item.details?.find((d) => d.label === "DISTILLED")?.value || "—";
  const cask = item.details?.find((d) => d.label === "CASK")?.value || "—";
  const rarity = item.details?.find((d) => d.label === "RARITY")?.value || "—";

  return (
    <>
      <section className="detailed-page whisky-detailed-page">
        <div className="detailed-page__bg-overlay whisky-bg-overlay"></div>
        <div className="container detailed-page__container">
          {/* Breadcrumb */}
          <div className="detailed-page__breadcrumb">
            <Link to="/whiskyListings" className="breadcrumb-link">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="breadcrumb-arrow"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Listings
            </Link>
          </div>

          {/* Success Toast */}
          {successMessage && (
            <div className="bid-toast-notification">
              <div className="toast-content">
                <span className="toast-dot"></span>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          {/* Main Two-Column Grid */}
          <div className="detailed-page__grid">
            {/* ── Left: Image Gallery & Info ─────────────────── */}
            <div className="detailed-page__gallery-and-info">
              {/* Main Image with Magnifier */}
              <div
                className="detailed-page__main-image-wrapper whisky-image-wrapper"
                ref={magnifierRef}
                onMouseMove={handleMagnifierMove}
                onMouseLeave={handleMagnifierLeave}
              >
                <img
                  src={mainImage}
                  alt={item.title}
                  className="detailed-page__main-image whisky-main-image"
                />
                <div className="detailed-page__image-glow"></div>

                {magnifier.visible && (
                  <div
                    className="detailed-page__magnifier-lens"
                    style={{
                      width: LENS_SIZE,
                      height: LENS_SIZE,
                      left: magnifier.x - LENS_SIZE / 2,
                      top: magnifier.y - LENS_SIZE / 2,
                      backgroundImage: `url(${mainImage})`,
                      backgroundSize: `${magnifier.wrapperW * ZOOM}px ${magnifier.wrapperH * ZOOM}px`,
                      backgroundPosition: `${magnifier.bgX}px ${magnifier.bgY}px`,
                    }}
                  />
                )}
              </div>

              {/* Title */}
              <h1 className="detailed-page__title">
                {item.title}{" "}
                <span className="detailed-page__reference">
                  {item.reference}
                </span>
              </h1>

              {/* Whisky-specific metadata strip */}
              <div className="whisky-meta-strip">
                <div className="whisky-meta-item">
                  <span className="whisky-meta-label">DISTILLERY</span>
                  <span className="whisky-meta-value">{distillery}</span>
                </div>
                <div className="whisky-meta-divider" />
                <div className="whisky-meta-item">
                  <span className="whisky-meta-label">DISTILLED</span>
                  <span className="whisky-meta-value">{distilled}</span>
                </div>
                <div className="whisky-meta-divider" />
                <div className="whisky-meta-item">
                  <span className="whisky-meta-label">CASK</span>
                  <span className="whisky-meta-value">{cask}</span>
                </div>
                <div className="whisky-meta-divider" />
                <div className="whisky-meta-item">
                  <span className="whisky-meta-label">RARITY</span>
                  <span className="whisky-meta-value">{rarity}</span>
                </div>
              </div>

              {/* Detailed Description */}
              <p className="detailed-page__description">
                {item.detailedDescription || item.description}
              </p>

              {/* Thumbnails */}
              <div className="detailed-page__thumbnails">
                {thumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    className={`detailed-page__thumb-item ${activeThumbIdx === idx ? "detailed-page__thumb-item--active" : ""}`}
                    onClick={() => {
                      setMainImage(thumb);
                      setActiveThumbIdx(idx);
                    }}
                  >
                    <img
                      src={thumb}
                      alt={`View ${idx + 1}`}
                      className="detailed-page__thumb-img"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Bid Sidebar ──────────────────────────── */}
            <div className="detailed-page__sidebar">
              <div className="detailed-page__card">
                {/* Countdown Timer */}
                <div className="detailed-page__timer-section">
                  <span className="detailed-page__timer-title">
                    AUCTION CLOSES IN
                  </span>
                  <div className="detailed-page__timer-row">
                    <div className="timer-block">
                      <span className="timer-number">
                        {formatNum(timeLeft.days)}
                      </span>
                      <span className="timer-label">DAYS</span>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="timer-block">
                      <span className="timer-number">
                        {formatNum(timeLeft.hours)}
                      </span>
                      <span className="timer-label">HRS</span>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="timer-block">
                      <span className="timer-number">
                        {formatNum(timeLeft.minutes)}
                      </span>
                      <span className="timer-label">MIN</span>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="timer-block">
                      <span className="timer-number">
                        {formatNum(timeLeft.seconds)}
                      </span>
                      <span className="timer-label">SEC</span>
                    </div>
                  </div>
                </div>

                <div className="sidebar-divider"></div>

                {/* Current Bid & Reserve */}
                <div className="detailed-page__bid-status">
                  <div className="bid-status-col">
                    <span className="panel-label">CURRENT BID</span>
                    <span className="panel-value panel-value--large">
                      {formatCurrency(currentBid)}
                    </span>
                  </div>
                  <div className="bid-status-col text-right">
                    <span className="panel-label">RESERVE</span>
                    <span
                      className={`panel-value panel-value--reserve ${item.reserveMet || currentBid >= item.currentBidNumber * 1.05 ? "reserve-met" : ""}`}
                    >
                      {item.reserveMet ||
                      currentBid >= item.currentBidNumber * 1.05 ? (
                        <>
                          <svg
                            className="check-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          MET
                        </>
                      ) : (
                        "NOT MET"
                      )}
                    </span>
                  </div>
                </div>

                <div className="sidebar-divider"></div>

                {/* Increment & Bidders */}
                <div className="detailed-page__bid-specs">
                  <div className="spec-col">
                    <span className="panel-label">BID INCREMENT:</span>
                    <span className="panel-value">
                      {formatCurrency(item.bidIncrement)}
                    </span>
                  </div>
                  <div className="spec-col text-right">
                    <span className="panel-value">{biddersCount} ACTIVE</span>
                    <span className="panel-label">BIDDERS</span>
                  </div>
                </div>

                {/* Place Bid Button */}
                <button
                  className="detailed-page__place-bid-btn"
                  onClick={handlePlaceBidClick}
                >
                  PLACE BID
                </button>

                {/* Secondary Actions */}
                <div className="detailed-page__action-row">
                  {/* <button
                    className={`action-btn-secondary ${isAutoBidding ? "action-btn-secondary--active" : ""}`}
                    onClick={() => setIsAutoBidding(!isAutoBidding)}
                  >
                    <svg
                      className="action-icon"
                      viewBox="0 0 24 24"
                      fill={isAutoBidding ? "#000" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    {isAutoBidding ? "AUTO BID ACTIVE" : "AUTO BID"}
                  </button> */}
                  <button
                    className={`action-btn-secondary ${isFavorited ? "action-btn-secondary--active" : ""}`}
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <svg
                      className="action-icon"
                      viewBox="0 0 24 24"
                      fill={isFavorited ? "#e1af4a" : "none"}
                      stroke={isFavorited ? "#e1af4a" : "currentColor"}
                      strokeWidth="2"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {isFavorited ? "Added to watchlist" : "Add to watchlist"}
                  </button>
                </div>

                <div className="sidebar-divider"></div>

                {/* Live Activity */}
                <div className="detailed-page__live-activity">
                  <div className="live-activity-header">
                    <span className="live-activity-title">LIVE ACTIVITY</span>
                    <span className="live-pulse"></span>
                  </div>
                  <div className="live-activity-list">
                    {bids.map((bid, index) => (
                      <div className="live-bid-item" key={bid.id || index}>
                        <div className="bid-user-info">
                          <span className="bid-username">
                            {index + 1}. {bid.member}
                          </span>
                          <span className="bid-timestamp">
                            {bid.timeAgo || "Just now"}
                          </span>
                        </div>
                        <div className="bid-amount-value">{bid.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs: Provenance / Authentication / Condition ─── */}
          <div className="detailed-page__tabs-container">
            <div className="detailed-page__tabs-header">
              <button
                className={`tab-link-btn ${activeTab === "provenance" ? "tab-link-btn--active" : ""}`}
                onClick={() => setActiveTab("provenance")}
              >
                PROVENANCE
                {activeTab === "provenance" && (
                  <span className="tab-indicator"></span>
                )}
              </button>
              <button
                className={`tab-link-btn ${activeTab === "auth" ? "tab-link-btn--active" : ""}`}
                onClick={() => setActiveTab("auth")}
              >
                AUTHENTICATION
                {activeTab === "auth" && (
                  <span className="tab-indicator"></span>
                )}
              </button>
              <button
                className={`tab-link-btn ${activeTab === "condition" ? "tab-link-btn--active" : ""}`}
                onClick={() => setActiveTab("condition")}
              >
                CONDITION REPORT
                {activeTab === "condition" && (
                  <span className="tab-indicator"></span>
                )}
              </button>
            </div>

            <div className="detailed-page__tabs-content">
              {/* Provenance Tab */}
              {activeTab === "provenance" && (
                <div className="tab-panel-grid fade-in-animation">
                  <div className="tab-panel-info">
                    <h3 className="tab-panel-heading">
                      {item.provenance?.title || "Decades of Excellence"}
                    </h3>
                    <p className="tab-panel-text">
                      {item.provenance?.description || item.description}
                    </p>
                  </div>
                  <div className="tab-panel-interactive">
                    <div className="ownership-timeline">
                      {(item.provenance?.timeline || []).map((t, idx) => (
                        <div className="timeline-card" key={idx}>
                          <span className="timeline-period">{t.period}</span>
                          <p className="timeline-detail">{t.detail}</p>
                        </div>
                      ))}
                    </div>
                    <button className="view-registry-btn">
                      VIEW FULL DOSSIER
                    </button>
                  </div>
                </div>
              )}

              {/* Authentication Tab */}
              {activeTab === "auth" && (
                <div className="tab-panel-grid fade-in-animation">
                  <div className="tab-panel-info">
                    <h3 className="tab-panel-heading">
                      Certified Authenticity
                    </h3>
                    <p className="tab-panel-text">
                      {item.authentication ||
                        "Every bottle is subjected to rigorous verification including label analysis, fill-level inspection, wax seal integrity checks, and cross-referencing with distillery records."}
                    </p>
                  </div>
                  <div className="tab-panel-interactive">
                    <div className="auth-checks-list">
                      {[
                        "Distillery Archive Cross-Reference",
                        "Wax Seal & Capsule Integrity Verified",
                        "Label & Glass Provenance Confirmed",
                        "Fill Level & Ullage Assessed",
                        "Original Presentation Materials Intact",
                      ].map((check) => (
                        <div className="auth-check-item" key={check}>
                          <svg
                            className="auth-check-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Condition Tab */}
              {activeTab === "condition" && (
                <div className="tab-panel-grid fade-in-animation">
                  <div className="tab-panel-info">
                    <h3 className="tab-panel-heading">Condition Assessment</h3>
                    <p className="tab-panel-text">
                      Each bottle is assessed across four key physical criteria
                      by our in-house spirits specialists. The results below
                      reflect the state of this lot at the time of cataloguing.
                    </p>
                  </div>
                  <div className="tab-panel-interactive">
                    <div className="condition-grades-grid">
                      {item.conditionReport?.label?.map((lbl, i) => (
                        <div className="condition-grade-item" key={lbl}>
                          <span className="condition-lbl">{lbl}</span>
                          <span className="condition-val">
                            {item.conditionReport.value[i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bid Modal ───────────────────────────────────────────── */}
        {showBidModal && (
          <div className="bid-modal-overlay fade-in-animation">
            <div className="bid-modal-card">
              <button
                className="close-modal-btn"
                onClick={() => setShowBidModal(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="modal-header">
                <span className="modal-auction-badge">AUCTION LIVE</span>
                <h2 className="modal-title">Place Your Bid</h2>
              </div>

              <div className="modal-asset-card">
                <div className="modal-asset-thumb">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="modal-asset-info">
                  <span className="modal-asset-label">CURRENT LOT</span>
                  <p className="modal-asset-name">
                    {item.title} <span>{item.reference}</span>
                  </p>
                  
                </div>
              </div>

              <form onSubmit={submitCustomBid} className="modal-form">
                <div className="modal-bid-row">
                  <div className="modal-bid-stat">
                    <span className="modal-bid-stat-label">CURRENT BID</span>
                    <span className="modal-bid-stat-value">
                      {formatCurrency(currentBid)}
                    </span>
                  </div>
                  <div className="modal-bid-stat modal-bid-stat--right">
                    <span className="modal-bid-stat-label">MIN. NEXT BID</span>
                    <span className="modal-bid-stat-value modal-bid-stat-value--gold">
                      {formatCurrency(currentBid + item.bidIncrement)}
                    </span>
                  </div>
                </div>

                <div className="modal-input-section">
                  <label className="modal-input-label">
                    YOUR BID AMOUNT (USD)
                  </label>
                  <div className="modal-input-wrapper">
                    <span className="currency-prefix">$</span>
                    <input
                      type="number"
                      className="modal-bid-input"
                      value={customBidAmount}
                      onChange={(e) =>
                        setCustomBidAmount(Number(e.target.value))
                      }
                      min={currentBid + item.bidIncrement}
                      step={item.bidIncrement}
                      required
                      autoFocus
                    />
                  </div>
                  {bidError && <p className="modal-error-msg">{bidError}</p>}
                </div>

                

                <label className="modal-terms-row">
                  <input
                    type="checkbox"
                    className="modal-terms-check"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span className="modal-terms-text">
                    I accept the{" "}
                    <span className="modal-terms-link">Terms of Service</span>{" "}
                    and acknowledge that this bid constitutes a legally binding
                    contract to purchase the asset.
                  </span>
                </label>

                <button
                  type="submit"
                  className="submit-bid-btn"
                  disabled={!termsAccepted}
                >
                  CONFIRM BID
                </button>

                <div className="modal-secure-footer">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>SECURE VAULT ENCRYPTION</span>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Recommended Whiskies ────────────────────────────────── */}
        <div className="container">
          <div className="recommended-section">
            <div className="recommended-header">
              <div className="recommended-title-container">
                <span className="recommended-subtitle">FROM THE CELLAR</span>
                <h2 className="recommended-title">Continue Your Discovery</h2>
              </div>
              <Link to="/whiskyListings" className="view-all-auctions-link">
                VIEW ALL BOTTLES
              </Link>
            </div>
            <div className="recommended-grid">
              {whiskyDataList
                .filter((w) => w.itemId !== item.itemId)
                .slice(0, 3)
                .map((rec) => {
                  const isCask = rec.categoryId === 6 || rec.categoryName?.toLowerCase() === 'cask';
                  const recTitle = isCask ? (rec.details?.caskType || "Rare Cask") : (rec.details?.producerName || rec.categoryName || "Rare Whisky");
                  const recReference = isCask ? (rec.details?.distillesy || "") : (rec.details?.bottlingName || "");
                  const recImage = rec.details?.frontLabel || "";
                  const recBid = rec.currentPrice || rec.orignalPrice || rec.expectedPrice || 1000;
                  const linkPath = isCask ? `/cask/${rec.itemId}` : `/whisky/${rec.itemId}`;

                  return (
                    <Link
                      to={linkPath}
                      key={rec.itemId}
                      className="recommended-card-link"
                    >
                      <div className="recommended-card">
                        <div className="recommended-card__image-container">
                          <img
                            src={recImage}
                            alt={`${recTitle} ${recReference}`}
                            className="recommended-card__image"
                          />
                          <div className="recommended-card__gradient-overlay"></div>
                        </div>
                        <div className="recommended-card__info">
                          <span className="recommended-card__badge">
                            {isCask ? "CASK LOT" : "LIVE"}
                          </span>
                          <h3 className="recommended-card__title">
                            {recTitle} — {recReference}
                          </h3>
                          <p className="recommended-card__estimate">
                            Current Bid: {formatCurrency(recBid)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailedWhiskyPage;
