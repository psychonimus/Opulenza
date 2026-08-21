import { useEffect, useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import {
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdDelete,
  MdDescription,
  MdFileDownload,
  MdGavel,
  MdImage,
  MdOpenInNew,
  MdSearch,
  MdVisibility,
} from "react-icons/md";
import {
  getApprovedListing,
  getItemMedia,
} from "../../../services/sellingServices/getSellListings/getSellListings";
import {
  base64ToBuffer,
  decryptFile,
  getEncryptionSecret,
} from "../../../utils/fileEncryption";

const CATEGORIES = [
  { id: 0, name: "All" },
  { id: 3, name: "Watches" },
  { id: 2, name: "Whisky" },
  { id: 6, name: "Casks" },
  { id: 1, name: "Cigars" },
  { id: 4, name: "Pens" },
  { id: 5, name: "Yachts" },
];

/** Safely convert any value to something React can render in a <td>. */
const renderCell = (value) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value
        .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
        .join(", ");
    }
    return JSON.stringify(value);
  }
  return String(value) || "—";
};

const AuctionManagement = () => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState(0);
  const [appliedCat, setAppliedCat] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataResult, setDataResult] = useState([]);

  // Preview modal state
  const [selectedListing, setSelectedListing] = useState(null);
  const [mediaCache, setMediaCache] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const PAGE_SIZE = 10;

  // ── Media helpers ────────────────────────────────────────────────────────────

  const triggerDownload = (url, fileName) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFetchAndDecrypt = async (media, action = "view") => {
    const mediaId = media?.id;
    const itemId = media?.itemId || selectedListing?.itemId;
    if (!itemId || !mediaId) return;

    const current = mediaCache[mediaId];
    if (current?.url) {
      if (action === "download") {
        triggerDownload(current.url, media.originalFileName || `media_${mediaId}`);
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
        res?.data?.data?.encryptedFile ||
        res?.data?.encryptedFile ||
        res?.data?.data ||
        res?.data;

      let blob;
      if (media.salt && media.iv) {
        const secret = getEncryptionSecret();
        const decryptedBuffer = await decryptFile(
          rawPayload,
          secret,
          media.salt,
          media.iv,
        );
        blob = new Blob([decryptedBuffer], {
          type: media.contentType || "application/octet-stream",
        });
      } else {
        if (typeof rawPayload === "string") {
          const buffer = base64ToBuffer(rawPayload);
          blob = new Blob([buffer], {
            type: media.contentType || "application/octet-stream",
          });
        } else if (rawPayload instanceof Blob) {
          blob = rawPayload;
        } else {
          blob = new Blob([rawPayload], {
            type: media.contentType || "application/octet-stream",
          });
        }
      }

      const objectUrl = URL.createObjectURL(blob);

      setMediaCache((prev) => ({
        ...prev,
        [mediaId]: { loading: false, url: objectUrl, error: null },
      }));

      if (action === "download") {
        triggerDownload(objectUrl, media.originalFileName || `media_${mediaId}`);
      } else if (action === "preview-image") {
        setPreviewImage({
          url: objectUrl,
          name: media.originalFileName || `Image #${mediaId}`,
        });
      } else if (action === "view") {
        window.open(objectUrl, "_blank");
      }
    } catch (err) {
      console.error(`Decryption failed for media #${mediaId}:`, err);
      setMediaCache((prev) => ({
        ...prev,
        [mediaId]: {
          loading: false,
          url: null,
          error: err.message || "Failed to decrypt media",
        },
      }));
    }
  };

  // Auto-fetch & decrypt all media as soon as a listing modal is opened
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
        handleFetchAndDecrypt(media, "preload");
      }
    });
  }, [selectedListing]);

  // ── Data fetching ────────────────────────────────────────────────────────────

  const handleApply = () => {
    getApprovedListing(selectedCat)
      .then((res) => {
        setDataResult(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  };

  const filtered = (dataResult ?? []).filter((l) => {
    const matchesCat = appliedCat === "All" || l.category === appliedCat;
    const matchesSearch =
      search.trim() === ""
        ? true
        : Object.values(l).some((v) =>
            String(v ?? "")
              .toLowerCase()
              .includes(search.toLowerCase()),
          );
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const goToPage = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  useEffect(() => {
    handleApply();
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="ap-page" data-lenis-prevent="true">
      <div className="ap-page-header">
        <div>
          <h1 className="ap-page-title">Auction Management</h1>
          <p className="ap-page-subtitle">
            Monitor active auctions, bids, and scheduling.
          </p>
        </div>
        <button className="ap-btn ap-btn--primary">
          <MdGavel size={16} /> Create Auction
        </button>
      </div>

      <div className="ap-stat-row">
        {[
          { label: "Live Auctions", value: "32", color: "#15803d" },
          { label: "Scheduled", value: "14", color: "#1d4ed8" },
          { label: "Ended Today", value: "8", color: "#6b7280" },
          { label: "Total Bids (7d)", value: "1,482", color: "#3b5bdb" },
        ].map((s) => (
          <div key={s.label} className="ap-mini-stat">
            <span className="ap-mini-stat__label">{s.label}</span>
            <span className="ap-mini-stat__value" style={{ color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

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

      <div className="ap-toolbar">
        <div className="ap-search">
          <MdSearch size={16} className="ap-search__icon" />
          <input
            className="ap-search__input"
            placeholder="Search auctions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ap-table-card">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Action</th>
              {dataResult?.length > 0 && (
                <>
                  {Object.keys(dataResult[0])
                    .filter((item) => item !== "details")
                    .map((item, id) => (
                      <th key={id}>{item}</th>
                    ))}

                  {Object.keys(dataResult[0]?.details || {}).map((item, id) => (
                    <th key={`details-${id}`}>{item}</th>
                  ))}
                </>
              )}
            </tr>
          </thead>
          <tbody data-lenis-prevent="true">
            {dataResult?.length > 0 ? (
              dataResult.map((l, key) => (
                <tr key={key}>
                  <td>
                    <div className="ap-action-group">
                      {/* View Details */}
                      <button
                        className="ap-icon-btn ap-icon-btn--view"
                        title="View Details"
                        onClick={() => setSelectedListing(l)}
                      >
                        <MdVisibility size={15} />
                      </button>
                      <button
                        className="ap-icon-btn"
                        onClick={() => {
                          // handleApproval(l);
                        }}
                      >
                        <FaCheckCircle size={15} />
                      </button>
                      <button className="ap-icon-btn ap-icon-btn--danger">
                        <MdDelete size={15} />
                      </button>
                    </div>
                  </td>

                  {Object.keys(l)
                    .filter((item) => item !== "details")
                    .map((item, id) => (
                      <td key={id}>{renderCell(l[item])}</td>
                    ))}

                  {/* Details fields */}
                  {Object.keys(l.details || {}).map((item, id) => (
                    <td key={`details-${id}`}>{renderCell(l.details[item])}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="ap-empty">
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

      {/* ── Item Details Modal ─────────────────────────────────────────────────── */}
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
                Auction #{selectedListing.itemId} Details
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
                              <span className="ap-modal-label">{labelName}</span>
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

              {/* Uploaded Documents Section */}
              <div className="ap-modal-section">
                <div className="ap-modal-section-header">
                  <h4 className="ap-modal-section-title">
                    Uploaded Documents (
                    {Array.isArray(selectedListing?.details?.documents)
                      ? selectedListing.details.documents.length
                      : 0}
                    )
                  </h4>
                </div>
                {Array.isArray(selectedListing?.details?.documents) &&
                selectedListing.details.documents.length > 0 ? (
                  <div className="ap-doc-grid">
                    {selectedListing.details.documents.map((doc) => {
                      const state = mediaCache[doc.id] || {};
                      const isPdf =
                        doc.contentType === "application/pdf" ||
                        doc.originalFileName?.toLowerCase().endsWith(".pdf");
                      const isImage =
                        doc.contentType?.startsWith("image/") ||
                        /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(
                          doc.originalFileName || "",
                        );
                      const ext =
                        doc.originalFileName?.split(".").pop()?.toUpperCase() ||
                        (isPdf ? "PDF" : "DOC");

                      return (
                        <div key={doc.id} className="ap-doc-card">
                          <div
                            className="ap-doc-thumb-wrap"
                            onClick={() => {
                              if (state.url) {
                                window.open(state.url, "_blank");
                              }
                            }}
                          >
                            {state.url ? (
                              isPdf ? (
                                <div className="ap-doc-embed-wrap">
                                  <iframe
                                    src={`${state.url}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                                    className="ap-doc-iframe-preview"
                                    title={doc.originalFileName}
                                    scrolling="no"
                                  />
                                  <div className="ap-doc-overlay-cover">
                                    <div className="ap-image-thumb-overlay">
                                      <MdOpenInNew size={18} />
                                      <span>Full View</span>
                                    </div>
                                  </div>
                                </div>
                              ) : isImage ? (
                                <>
                                  <img
                                    src={state.url}
                                    alt={
                                      doc.originalFileName ||
                                      `Document #${doc.id}`
                                    }
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
                                      <MdDescription
                                        size={46}
                                        color="#c5a059"
                                      />
                                    </div>
                                    <span className="ap-doc-type-pill">
                                      {ext}
                                    </span>
                                  </div>
                                  <div className="ap-image-thumb-overlay">
                                    <MdOpenInNew size={18} />
                                    <span>Full View</span>
                                  </div>
                                </>
                              )
                            ) : state.loading ? (
                              <div className="ap-image-thumb-placeholder">
                                <FaSpinner
                                  className="ap-spin"
                                  size={22}
                                  color="#d6a54d"
                                />
                                <span>Decrypting Document...</span>
                              </div>
                            ) : (
                              <div className="ap-image-thumb-placeholder">
                                <MdDescription size={32} color="#c5a059" />
                                <span>Ready to Decrypt</span>
                              </div>
                            )}
                          </div>
                          <div className="ap-doc-card__body">
                            <div
                              className="ap-doc-card__name"
                              title={
                                doc.originalFileName || `Document #${doc.id}`
                              }
                            >
                              {doc.originalFileName || `Document #${doc.id}`}
                            </div>

                            {state.error && (
                              <span className="ap-media-error-text">
                                {state.error}
                              </span>
                            )}
                            <div className="ap-doc-card__actions">
                              <button
                                type="button"
                                className="ap-media-btn ap-media-btn--gold"
                                disabled={!state.url}
                                onClick={() =>
                                  triggerDownload(
                                    state.url,
                                    doc.originalFileName ||
                                      `document_${doc.id}.pdf`,
                                  )
                                }
                                title="Download Decrypted Document"
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
                    Uploaded Images (
                    {Array.isArray(selectedListing?.details?.images)
                      ? selectedListing.details.images.length
                      : 0}
                    )
                  </h4>
                </div>
                {Array.isArray(selectedListing?.details?.images) &&
                selectedListing.details.images.length > 0 ? (
                  <div className="ap-image-grid">
                    {selectedListing.details.images.map((img) => {
                      const state = mediaCache[img.id] || {};
                      return (
                        <div key={img.id} className="ap-image-card">
                          <div
                            className="ap-image-thumb-wrap"
                            onClick={() => {
                              if (state.url) {
                                setPreviewImage({
                                  url: state.url,
                                  name:
                                    img.originalFileName ||
                                    `Image #${img.id}`,
                                });
                              }
                            }}
                          >
                            {state.url ? (
                              <>
                                <img
                                  src={state.url}
                                  alt={
                                    img.originalFileName || `Image #${img.id}`
                                  }
                                  className="ap-image-thumb"
                                />
                                <div className="ap-image-thumb-overlay">
                                  <MdVisibility size={18} />
                                  <span>Full View</span>
                                </div>
                              </>
                            ) : state.loading ? (
                              <div className="ap-image-thumb-placeholder">
                                <FaSpinner
                                  className="ap-spin"
                                  size={22}
                                  color="#d6a54d"
                                />
                                <span>Decrypting Image...</span>
                              </div>
                            ) : (
                              <div className="ap-image-thumb-placeholder">
                                <MdImage size={30} color="#c5a059" />
                                <span>Ready to Decrypt</span>
                              </div>
                            )}
                          </div>
                          <div className="ap-image-card__body">
                            <div
                              className="ap-image-card__name"
                              title={img.originalFileName || `Image #${img.id}`}
                            >
                              {img.originalFileName || `Image #${img.id}`}
                            </div>

                            {state.error && (
                              <span className="ap-media-error-text">
                                {state.error}
                              </span>
                            )}
                            <div className="ap-image-card__actions">
                              <button
                                type="button"
                                className="ap-media-btn ap-media-btn--gold"
                                disabled={!state.url}
                                onClick={() =>
                                  triggerDownload(
                                    state.url,
                                    img.originalFileName ||
                                      `image_${img.id}.jpg`,
                                  )
                                }
                                title="Download Decrypted Image"
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
            </div>

            <div className="ap-modal-footer">
              <button
                className="ap-btn ap-btn--ghost"
                onClick={() => setSelectedListing(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Image Lightbox Modal ────────────────────────────────────────────────── */}
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
                  Decrypted Full View
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

export default AuctionManagement;
