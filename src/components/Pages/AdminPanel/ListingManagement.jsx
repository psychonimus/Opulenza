import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdDelete,
  MdAddCircleOutline,
  MdChevronLeft,
  MdChevronRight,
  MdVisibility,
  MdClose,
  MdFileDownload,
  MdOpenInNew,
  MdDescription,
  MdImage,
} from "react-icons/md";
import {
  getSellListing,
  approveSellListing,
  getItemMedia,
} from "../../../services/sellingServices/getSellListings/getSellListings";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

const CATEGORIES = [
  { id: 0, name: "All" },
  { id: 3, name: "Watches" },
  { id: 2, name: "Whisky" },
  { id: 6, name: "Casks" },
  { id: 1, name: "Cigars" },
  { id: 4, name: "Pens" },
  { id: 5, name: "Yachts" },
];

const PAGE_SIZE = 10;

const renderCellValue = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") {
    if (Array.isArray(val)) {
      return val
        .map((item) =>
          typeof item === "object" ? JSON.stringify(item) : String(item),
        )
        .join(", ");
    }
    return (
      <div
        style={{
          fontSize: "0.75rem",
          lineHeight: "1.3",
          textAlign: "left",
          minWidth: "160px",
        }}
      >
        {Object.entries(val).map(([k, v]) => {
          if (v === null || v === undefined || v === "") return null;
          const displayVal =
            typeof v === "object" ? JSON.stringify(v) : String(v);
          const cleanVal =
            displayVal.includes("/") || displayVal.includes("\\")
              ? displayVal.split(/[/\\]/).pop()
              : displayVal;
          return (
            <div key={k} style={{ marginBottom: "2px" }}>
              <span
                style={{
                  color: "#d6a54d",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {k.replace(/([A-Z])/g, " $1")}:
              </span>{" "}
              <span title={displayVal}>{cleanVal}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return String(val);
};

const ListingManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(0);
  const [appliedCat, setAppliedCat] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataResult, setDataResult] = useState([]);
  const [approvingId, setApprovingId] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [mediaCache, setMediaCache] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const triggerDownload = (url, fileName) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFetchMedia = async (media, action = "view") => {
    const mediaId = media?.id;
    const itemId = media?.itemId || selectedListing?.itemId;
    if (!itemId || !mediaId) return;

    const current = mediaCache[mediaId];
    if (current?.url) {
      if (action === "download") {
        triggerDownload(
          current.url,
          media.originalFileName || `media_${mediaId}`,
        );
      } else if (action === "preview-image") {
        setPreviewImage({
          url: current.url,
          name: media.originalFileName || `Image #${mediaId}`,
        });
      } else if (action === "view") {
        window.open(current.url, "_blank");
      }
      return;
    }

    setMediaCache((prev) => ({
      ...prev,
      [mediaId]: { loading: true, url: null, error: null },
    }));

    try {
      const res = await getItemMedia(itemId, mediaId);
      const rawPayload =
        res?.data?.data ??
        res?.data ??
        res;

      let blob;
      if (rawPayload instanceof Blob) {
        blob = rawPayload;
      } else if (typeof rawPayload === "string") {
        // Treat as a direct URL if it looks like one, otherwise wrap in blob
        if (rawPayload.startsWith("http")) {
          setMediaCache((prev) => ({
            ...prev,
            [mediaId]: { loading: false, url: rawPayload, error: null },
          }));
          if (action === "download") {
            triggerDownload(rawPayload, media.originalFileName || `media_${mediaId}`);
          } else if (action === "preview-image") {
            setPreviewImage({ url: rawPayload, name: media.originalFileName || `Image #${mediaId}` });
          } else if (action === "view") {
            window.open(rawPayload, "_blank");
          }
          return;
        }
        blob = new Blob([rawPayload], {
          type: media.contentType || "application/octet-stream",
        });
      } else {
        blob = new Blob([rawPayload], {
          type: media.contentType || "application/octet-stream",
        });
      }

      const objectUrl = URL.createObjectURL(blob);

      setMediaCache((prev) => ({
        ...prev,
        [mediaId]: { loading: false, url: objectUrl, error: null },
      }));

      if (action === "download") {
        triggerDownload(
          objectUrl,
          media.originalFileName || `media_${mediaId}`,
        );
      } else if (action === "preview-image") {
        setPreviewImage({
          url: objectUrl,
          name: media.originalFileName || `Image #${mediaId}`,
        });
      } else if (action === "view") {
        window.open(objectUrl, "_blank");
      }
    } catch (err) {
      console.error(`Failed to fetch media #${mediaId}:`, err);
      setMediaCache((prev) => ({
        ...prev,
        [mediaId]: {
          loading: false,
          url: null,
          error: err.message || "Failed to load media",
        },
      }));
    }
  };

  // Auto-fetch all documents and images as soon as a listing modal is opened
  useEffect(() => {
    if (!selectedListing?.details) return;

    const allMedia = [
      ...(Array.isArray(selectedListing.details.documents)
        ? selectedListing.details.documents
        : []),
      ...(Array.isArray(selectedListing.details.images)
        ? selectedListing.details.images
        : []),
    ];

    allMedia.forEach((media) => {
      if (
        media?.id &&
        !mediaCache[media.id]?.url &&
        !mediaCache[media.id]?.loading
      ) {
        handleFetchMedia(media, "preload");
      }
    });
  }, [selectedListing]);

  const fetchListings = (catId = appliedCat, page = currentPage) => {
    getSellListing({ selectedCat: catId, currentPage: page })
      .then((res) => {
        const listData =
          res?.data?.data ||
          res?.data?.paginated ||
          res?.data?.items ||
          (Array.isArray(res?.data) ? res.data : []);
        setDataResult(listData);
      })
      .catch((err) => {
        console.error("Error fetching sell listings:", err);
        setDataResult([]);
      });
  };

  const handleApply = () => {
    setAppliedCat(selectedCat);
    if (currentPage === 1) {
      fetchListings(selectedCat, 1);
    } else {
      setCurrentPage(1);
    }
  };

  // Filter by category + search
  const filtered = (dataResult ?? []).filter((l) => {
    const catName = CATEGORIES.find((c) => c.id === appliedCat)?.name || "All";
    const matchesCat =
      appliedCat === 0 ||
      catName === "All" ||
      l.categoryId === appliedCat ||
      l.categoryName?.toLowerCase() === catName.toLowerCase() ||
      l.category?.toLowerCase() === catName.toLowerCase();

    const searchStr = search.trim().toLowerCase();
    if (!searchStr) return matchesCat;

    const matchesSearch =
      String(l.itemId ?? "")
        .toLowerCase()
        .includes(searchStr) ||
      String(l.memberName ?? "")
        .toLowerCase()
        .includes(searchStr) ||
      String(l.categoryName ?? "")
        .toLowerCase()
        .includes(searchStr) ||
      String(l.expectedPrice ?? "")
        .toLowerCase()
        .includes(searchStr) ||
      String(l.orignalPrice ?? "")
        .toLowerCase()
        .includes(searchStr) ||
      (l.details &&
        typeof l.details === "object" &&
        Object.values(l.details).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(searchStr),
        ));

    return matchesCat && matchesSearch;
  });

  // Server handles pagination per page, but if backend returns full list, client slices.
  const isServerPaginated = dataResult.length <= PAGE_SIZE;
  const totalPages = isServerPaginated
    ? Math.max(1, currentPage + (dataResult.length === PAGE_SIZE ? 1 : 0))
    : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = isServerPaginated
    ? filtered
    : filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchListings(appliedCat, currentPage);
  }, [currentPage]);

  const handleApproval = (l) => {
    if (!l?.itemId) return;
    setApprovingId(l.itemId);
    const dataObj = {
      itemId: l.itemId,
      IsApproved: true,
      Reason: "Approved by Admin",
    };

    approveSellListing(dataObj)
      .then((res) => {
        console.log("Listing approved successfully", res);
        setApprovingId(null);
        fetchListings(appliedCat, currentPage);
      })
      .catch((error) => {
        console.error("Failed to approve listing:", error);
        setApprovingId(null);
      });
  };

  return (
    <div className="ap-page" data-lenis-prevent="true">
      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Listing Management</h1>
          <p className="ap-page-subtitle">
            Browse, approve, and moderate all marketplace listings.
          </p>
        </div>
        <button className="ap-btn ap-btn--primary">
          <MdAddCircleOutline size={16} /> New Listing
        </button>
      </div>

      {/* Stats */}
      <div className="ap-stat-row">
        {[
          {
            label: "Total Listings",
            value: dataResult?.length || "0",
            color: "#3b5bdb",
          },
          { label: "Live", value: "7,814", color: "#15803d" },
          { label: "Pending Review", value: "482", color: "#b45309" },
          { label: "Removed", value: "106", color: "#b91c1c" },
        ].map((s) => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="ap-category-filter">
        <span className="ap-category-filter__label">Category</span>
        <div className="ap-category-filter__chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`ap-category-chip${selectedCat === cat.id ? " ap-category-chip--active" : ""}`}
              onClick={() => setSelectedCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button
          className="ap-btn ap-btn--primary ap-category-filter__apply"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>

      {/* Toolbar */}
      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search listings…"
            value={search}
            onChange={handleSearch}
          />
        </div>
        {appliedCat !== 0 && (
          <span className="ap-active-filter-tag">
            {CATEGORIES.find((c) => c.id === appliedCat)?.name || "Filtered"}
            <button
              className="ap-active-filter-tag__clear"
              onClick={() => {
                setSelectedCat(0);
                setAppliedCat(0);
                setCurrentPage(1);
                fetchListings(0, 1);
              }}
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Action</th>
              {dataResult?.length > 0 &&
                Object.keys(dataResult[0])
                  ?.filter((item) => item !== "details")
                  ?.map((item, id) => {
                    const formattedHeader = item
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace("Orignal", "Original");
                    return <th key={id}>{formattedHeader}</th>;
                  })}
            </tr>
          </thead>
          <tbody data-lenis-prevent="true">
            {paginated.length > 0 ? (
              paginated.map((l, key) => (
                <tr key={key}>
                  <td>
                    <div className="ap-action-group">
                      <button
                        className="ap-icon-btn ap-icon-btn--view"
                        title="View Details"
                        onClick={() => setSelectedListing(l)}
                      >
                        <MdVisibility size={15} />
                      </button>
                      <button
                        className="ap-icon-btn"
                        title="Approve Listing"
                        disabled={approvingId === l?.itemId}
                        onClick={() => {
                          handleApproval(l);
                        }}
                      >
                        <FaCheckCircle size={15} />
                      </button>
                      <button
                        className="ap-icon-btn ap-icon-btn--danger"
                        title="Delete Listing"
                      >
                        <MdDelete size={15} />
                      </button>
                    </div>
                  </td>
                  {Object.keys(l)
                    ?.filter((item) => item !== "details")
                    ?.map((item, id) => (
                      <td key={id}>{renderCellValue(l[item])}</td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    dataResult?.length > 0
                      ? Object.keys(dataResult[0]).filter(
                          (item) => item !== "details",
                        ).length + 1
                      : 8
                  }
                  className="ap-empty"
                >
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="ap-pagination">
        <span className="ap-pagination__info">
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
          {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
          listings
        </span>
        <div className="ap-pagination__controls">
          <button
            className="ap-pagination__btn"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
          >
            <MdChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`ap-pagination__btn${safePage === p ? " ap-pagination__btn--active" : ""}`}
              onClick={() => goToPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="ap-pagination__btn"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
          >
            <MdChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedListing && (
        <div className="ap-modal-overlay" data-lenis-prevent="true">
          <div
            className="ap-modal-container"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
          >
            <div className="ap-modal-header">
              <h3 className="ap-modal-title">
                <MdVisibility size={18} color="#d6a54d" />
                Listing #{selectedListing.itemId} Details
              </h3>
              <button
                className="ap-modal-close"
                onClick={() => setSelectedListing(null)}
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="ap-modal-body" data-lenis-prevent="true">
              {/* Item Overview Section */}
              <div className="ap-modal-section">
                <h4 className="ap-modal-section-title">Item Overview</h4>
                <div className="ap-modal-grid">
                  <div className="ap-modal-item">
                    <span className="ap-modal-label">Item ID</span>
                    <span className="ap-modal-value">
                      #{selectedListing.itemId}
                    </span>
                  </div>
                  <div className="ap-modal-item">
                    <span className="ap-modal-label">Member Name</span>
                    <span className="ap-modal-value">
                      {selectedListing.memberName || "—"}
                    </span>
                  </div>
                  <div className="ap-modal-item">
                    <span className="ap-modal-label">Category</span>
                    <span className="ap-modal-value">
                      {selectedListing.categoryName ||
                        selectedListing.category ||
                        "—"}
                    </span>
                  </div>
                  <div className="ap-modal-item">
                    <span className="ap-modal-label">Original Price</span>
                    <span className="ap-modal-value">
                      {selectedListing.orignalPrice != null
                        ? `$${selectedListing.orignalPrice}`
                        : "—"}
                    </span>
                  </div>
                  <div className="ap-modal-item">
                    <span className="ap-modal-label">Expected Price</span>
                    <span className="ap-modal-value">
                      {selectedListing.expectedPrice != null
                        ? `$${selectedListing.expectedPrice}`
                        : "—"}
                    </span>
                  </div>
                  <div className="ap-modal-item">
                    <span className="ap-modal-label">Auction End Date</span>
                    <span className="ap-modal-value">
                      {selectedListing.auctionEndDate
                        ? new Date(
                            selectedListing.auctionEndDate,
                          ).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              {selectedListing.details &&
                typeof selectedListing.details === "object" && (
                  <div className="ap-modal-section">
                    <h4 className="ap-modal-section-title">Specifications</h4>
                    <div className="ap-modal-grid">
                      {Object.entries(selectedListing.details)
                        .filter(
                          ([key]) => key !== "documents" && key !== "images",
                        )
                        .map(([key, val]) => {
                          const labelName = key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());
                          let displayVal = "—";
                          if (val !== null && val !== undefined && val !== "") {
                            const strVal = String(val);
                            displayVal =
                              strVal.includes("/") || strVal.includes("\\")
                                ? strVal.split(/[/\\]/).pop()
                                : strVal;
                          }
                          return (
                            <div key={key} className="ap-modal-item">
                              <span className="ap-modal-label">
                                {labelName}
                              </span>
                              <span
                                className="ap-modal-value"
                                title={String(val ?? "")}
                              >
                                {displayVal}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

              {/* ── derive flat lists of docs & images from details URL strings ── */}
              {(() => {
                const details = selectedListing?.details || {};
                const allMedia = Object.entries(details)
                  .filter(([, v]) => typeof v === "string" && /^https?:\/\//i.test(v));

                const docEntries = allMedia.filter(([, url]) =>
                  /\/Items\/Documents\//i.test(url)
                );
                const imgEntries = allMedia.filter(([, url]) =>
                  /\/Items\/Images\//i.test(url)
                );

                const isPdfUrl = (url) => /\.pdf(\?|$)/i.test(url);
                const isImgUrl = (url) => /\.(jpe?g|png|webp|gif|bmp|svg)(\?|$)/i.test(url);
                const extFromUrl = (url) =>
                  (url.split("?")[0].split(".").pop() || "FILE").toUpperCase();

                return (
                  <>
                    {/* Uploaded Documents Section */}
                    <div className="ap-modal-section">
                      <div className="ap-modal-section-header">
                        <h4 className="ap-modal-section-title">
                          Uploaded Documents ({docEntries.length})
                        </h4>
                      </div>
                      {docEntries.length > 0 ? (
                        <div className="ap-doc-grid">
                          {docEntries.map(([key, url]) => {
                            const pdf = isPdfUrl(url);
                            const img = isImgUrl(url);
                            const ext = extFromUrl(url);
                            const label = key.replace(/([A-Z])/g, " $1").trim();
                            return (
                              <div key={key} className="ap-doc-card">
                                <div
                                  className="ap-doc-thumb-wrap"
                                  onClick={() => window.open(url, "_blank")}
                                >
                                  {pdf ? (
                                    <div className="ap-doc-embed-wrap">
                                      <iframe
                                        src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                                        className="ap-doc-iframe-preview"
                                        title={label}
                                        scrolling="no"
                                      />
                                      <div className="ap-doc-overlay-cover">
                                        <div className="ap-image-thumb-overlay">
                                          <MdOpenInNew size={18} />
                                          <span>Full View</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : img ? (
                                    <>
                                      <img
                                        src={url}
                                        alt={label}
                                        className="ap-image-thumb"
                                      />
                                      <div className="ap-image-thumb-overlay">
                                        <MdOpenInNew size={18} />
                                        <span>Full View</span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="ap-doc-paper-preview">
                                        <div className="ap-doc-paper-icon">
                                          <MdDescription size={46} color="#c5a059" />
                                        </div>
                                        <span className="ap-doc-type-pill">{ext}</span>
                                      </div>
                                      <div className="ap-image-thumb-overlay">
                                        <MdOpenInNew size={18} />
                                        <span>Full View</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="ap-doc-card__body">
                                  <div className="ap-doc-card__name" title={label}>
                                    {label}
                                  </div>
                                  <div className="ap-doc-card__actions">
                                    <button
                                      type="button"
                                      className="ap-media-btn ap-media-btn--gold"
                                      onClick={() => triggerDownload(url, `${key}.${ext.toLowerCase()}`)}
                                      title="Download Document"
                                    >
                                      <MdFileDownload size={14} /> Download
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="ap-media-empty">
                          No documents uploaded for this listing.
                        </div>
                      )}
                    </div>

                    {/* Uploaded Images Section */}
                    <div className="ap-modal-section">
                      <div className="ap-modal-section-header">
                        <h4 className="ap-modal-section-title">
                          Uploaded Images ({imgEntries.length})
                        </h4>
                      </div>
                      {imgEntries.length > 0 ? (
                        <div className="ap-image-grid">
                          {imgEntries.map(([key, url]) => {
                            const label = key.replace(/([A-Z])/g, " $1").trim();
                            return (
                              <div key={key} className="ap-image-card">
                                <div
                                  className="ap-image-thumb-wrap"
                                  onClick={() =>
                                    setPreviewImage({ url, name: label })
                                  }
                                >
                                  <>
                                    <img
                                      src={url}
                                      alt={label}
                                      className="ap-image-thumb"
                                    />
                                    <div className="ap-image-thumb-overlay">
                                      <MdVisibility size={18} />
                                      <span>Full View</span>
                                    </div>
                                  </>
                                </div>
                                <div className="ap-image-card__body">
                                  <div className="ap-image-card__name" title={label}>
                                    {label}
                                  </div>
                                  <div className="ap-image-card__actions">
                                    <button
                                      type="button"
                                      className="ap-media-btn ap-media-btn--gold"
                                      onClick={() => triggerDownload(url, `${key}.jpg`)}
                                      title="Download Image"
                                    >
                                      <MdFileDownload size={14} /> Download
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="ap-media-empty">
                          No images uploaded for this listing.
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

            </div>

            <div className="ap-modal-footer">
              <button
                className="ap-btn ap-btn--ghost"
                onClick={() => setSelectedListing(null)}
              >
                Close
              </button>
              <button
                className="ap-btn ap-btn--success"
                disabled={approvingId === selectedListing.itemId}
                onClick={() => {
                  handleApproval(selectedListing);
                  setSelectedListing(null);
                }}
              >
                <FaCheckCircle size={14} /> Approve Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          className="ap-modal-overlay"
          style={{ zIndex: 10000 }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="ap-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ap-lightbox-header">
              <div className="ap-lightbox-title-wrap">
                <MdImage size={18} color="#d6a54d" />
                <span className="ap-lightbox-title">{previewImage.name}</span>
                <span className="ap-media-badge ap-media-badge--decrypted">
                  Full View
                </span>
              </div>
              <div className="ap-lightbox-actions">
                <button
                  className="ap-media-btn ap-media-btn--gold"
                  onClick={() =>
                    triggerDownload(previewImage.url, previewImage.name)
                  }
                  title="Download Image"
                >
                  <MdFileDownload size={14} /> Download
                </button>
                <button
                  className="ap-modal-close"
                  onClick={() => setPreviewImage(null)}
                  title="Close Preview"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
            <div className="ap-lightbox-body">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="ap-lightbox-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingManagement;
