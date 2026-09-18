import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
// import whiskyData, { CaskData } from "../../../../data/WhiskyData";
import "./AllWhisky.css";
import { getApprovedListing, updateWishListItem } from '../../../../services/sellingServices/getSellListings/getSellListings'
import { useUser } from "../../../../services/showUserInfo/ShowUserInfo";
import { ConvertCurrency } from "../../../../services/convertCurrency/ConvertCurrency";


const AllWhisky = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const tabParam =
    searchParams.get("tab") ||
    location.state?.fromTab ||
    sessionStorage.getItem("whisky_active_tab") ||
    "whisky";
  const initialTab = tabParam === "cask" ? "cask" : "whisky";

  const initialWhiskyPage =
    Number(
      searchParams.get("whiskyPage") ||
      (initialTab === "whisky" ? searchParams.get("page") : null) ||
      location.state?.whiskyPage ||
      (initialTab === "whisky" ? location.state?.fromPage : null) ||
      sessionStorage.getItem("whisky_page")
    ) || 1;

  const initialCaskPage =
    Number(
      searchParams.get("caskPage") ||
      (initialTab === "cask" ? searchParams.get("page") : null) ||
      location.state?.caskPage ||
      (initialTab === "cask" ? location.state?.fromPage : null) ||
      sessionStorage.getItem("cask_page")
    ) || 1;

  const [activeTab, setActiveTab] = useState(initialTab);

  const [whiskies, setWhiskies] = useState([])
  const [casks, setCasks] = useState([])

  const [whiskyPage, setWhiskyPage] = useState(initialWhiskyPage)
  const [whiskyTotalPages, setWhiskyTotalPages] = useState(1)
  const [whiskyLoading, setWhiskyLoading] = useState(false)

  const [caskPage, setCaskPage] = useState(initialCaskPage)
  const [caskTotalPages, setCaskTotalPages] = useState(1)
  const [caskLoading, setCaskLoading] = useState(false)

  const [favorites, setFavorites] = useState({})

  const { userInfo, refreshUser } = useUser();
  const preferredCurrency = userInfo?.preferences?.preferredCurrency || "USD";

  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    sessionStorage.setItem("whisky_active_tab", activeTab);
    sessionStorage.setItem("whisky_page", String(whiskyPage));
    sessionStorage.setItem("cask_page", String(caskPage));
  }, [activeTab, whiskyPage, caskPage]);

  useEffect(() => {
    const currentTab = searchParams.get("tab") || location.state?.fromTab;
    if (currentTab && (currentTab === "whisky" || currentTab === "cask") && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const pageNum = Number(pageParam);
      if (pageNum && pageNum > 0) {
        if (currentTab === "cask" || activeTab === "cask") {
          setCaskPage(pageNum);
        } else {
          setWhiskyPage(pageNum);
        }
      }
    }
  }, [searchParams, location.state]);

  useEffect(() => {
    if (!preferredCurrency || preferredCurrency === "USD") {
      setConversionRate(1);
      return;
    }

    ConvertCurrency(preferredCurrency)
      .then((res) => {
        const rate = res?.data?.rate || (res?.data?.rates && res?.data?.rates[preferredCurrency]) || 1;
        if (rate) {
          setConversionRate(rate);
        }
      })
      .catch((err) => {
        console.error("Currency conversion error:", err);
        setConversionRate(1);
      });
  }, [preferredCurrency]);

  const handleWishList = (itemId) => {
    const currentItem = whiskies.find(c => c.itemId === itemId)
    const currentFav = favorites[itemId] !== undefined
      ? favorites[itemId]
      : !!(currentItem?.isWishList ?? currentItem?.IsWishList)
    const newStatus = !currentFav

    const dataObject = {
      ItemId: itemId,
      IsWishList: newStatus
    }

    // Optimistically update UI
    setFavorites(prev => ({
      ...prev,
      [itemId]: newStatus
    }))
    setWhiskies(prev => prev.map(c => c.itemId === itemId ? { ...c, isWishList: newStatus, IsWishList: newStatus } : c))

    updateWishListItem(dataObject)
      .then((res) => {
        console.log("[Wishlist updated]", res?.data)
      })
      .catch((err) => {
        console.error("[Wishlist update failed]", err)
        // Revert on failure
        setFavorites(prev => ({
          ...prev,
          [itemId]: currentFav
        }))
        setWhiskies(prev => prev.map(c => c.itemId === itemId ? { ...c, isWishList: currentFav, IsWishList: currentFav } : c))
      })
  }

  const getWhiskyListings = (page = whiskyPage) => {
    setWhiskyLoading(true)
    getApprovedListing(2, page)
      .then((res) => {
        const list =
          res?.data?.data ||
          res?.data?.items ||
          res?.data?.paginated ||
          (Array.isArray(res?.data) ? res.data : [])
        setWhiskies(Array.isArray(list) ? list : [])

        const totalCount = res?.data?.totalCount || res?.data?.total || res?.data?.totalRecords
        if (res?.data?.totalPages) {
          setWhiskyTotalPages(res?.data.totalPages)
        } else if (totalCount) {
          setWhiskyTotalPages(Math.max(1, Math.ceil(totalCount / 10)))
        } else {
          setWhiskyTotalPages(page + (list.length === 10 ? 1 : 0))
        }
      })
      .catch((err) => {
        console.log(err)
        setWhiskies([])
      })
      .finally(() => {
        setWhiskyLoading(false)
      })
  }

  const getCasksListings = (page = caskPage) => {
    setCaskLoading(true)
    getApprovedListing(6, page)
      .then((res) => {
        const list =
          res?.data?.data ||
          res?.data?.items ||
          res?.data?.paginated ||
          (Array.isArray(res?.data) ? res.data : [])
        setCasks(Array.isArray(list) ? list : [])

        const totalCount = res?.data?.totalCount || res?.data?.total || res?.data?.totalRecords
        if (res?.data?.totalPages) {
          setCaskTotalPages(res?.data.totalPages)
        } else if (totalCount) {
          setCaskTotalPages(Math.max(1, Math.ceil(totalCount / 10)))
        } else {
          setCaskTotalPages(page + (list.length === 10 ? 1 : 0))
        }
      })
      .catch((err) => {
        console.log(err)
        setCasks([])
      })
      .finally(() => {
        setCaskLoading(false)
      })
  }

  useEffect(() => {
    getWhiskyListings(whiskyPage)
  }, [whiskyPage])

  useEffect(() => {
    getCasksListings(caskPage)
  }, [caskPage])

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    sessionStorage.setItem("whisky_active_tab", tab);
    const targetPage = tab === "cask" ? caskPage : whiskyPage;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      next.set("page", String(targetPage));
      return next;
    }, { replace: true });
    if (tab === "whisky") {
      getWhiskyListings(whiskyPage);
    } else {
      getCasksListings(caskPage);
    }
  };

  const handleWhiskyPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= whiskyTotalPages && newPage !== whiskyPage) {
      setWhiskyPage(newPage);
      sessionStorage.setItem("whisky_page", String(newPage));
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", "whisky");
        next.set("page", String(newPage));
        return next;
      }, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCaskPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= caskTotalPages && newPage !== caskPage) {
      setCaskPage(newPage);
      sessionStorage.setItem("cask_page", String(newPage));
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", "cask");
        next.set("page", String(newPage));
        return next;
      }, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const formatCurrency = (valInUsd) => {
    const num = Number(valInUsd);
    const validNum = isNaN(num) ? 0 : num;
    const convertedVal = validNum * (conversionRate || 1);
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: preferredCurrency || "USD",
        maximumFractionDigits: 0,
      }).format(convertedVal);
    } catch {
      return `${preferredCurrency || "USD"} ${Math.round(convertedVal).toLocaleString()}`;
    }
  };




  return (
    <section className="all-whisky-section">
      <div className="container">
        {/* Breadcrumb */}
        <div className="detailed-page__breadcrumb">
          <Link to="/bidPage" className="breadcrumb-link">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="breadcrumb-arrow"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Reserves
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="aw-tabs-container">
          <button
            type="button"
            id="tab-whisky"
            className={`aw-tab-btn${activeTab === "whisky" ? " aw-tab-btn--active" : ""}`}
            onClick={() => handleTabChange("whisky")}
          >
            Whisky
          </button>
          <button
            type="button"
            id="tab-cask"
            className={`aw-tab-btn${activeTab === "cask" ? " aw-tab-btn--active" : ""}`}
            onClick={() => handleTabChange("cask")}
          >
            Cask
          </button>
        </div>

        {/* ── Tab 1: Whisky ── */}
        {activeTab === "whisky" && (
          whiskies?.length === 0 ? (
            <div className="listings-empty-state">
              <div className="listings-empty-state__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="listings-empty-state__title">No Listings at the Moment</h3>
              <p className="listings-empty-state__sub">Our cellar masters are selecting the finest spirits. Revisit soon or consign your own rare bottle.</p>
              <Link to="/sell" className="listings-empty-state__cta">Submit an Asset</Link>
            </div>
          ) : (
            <>
              <div className="all-whisky-grid">
                {whiskies?.map((item) => {
                  const isFav = favorites[item.itemId] !== undefined
                    ? favorites[item.itemId]
                    : !!(item.isWishList ?? item.IsWishList);

                  return (

                    <div className="whisky-card">
                      <div className="whisky-card__image-wrapper">
                        <img
                          src={item?.details?.thumbnail}
                          alt={`${item?.details?.bottlingName} ${item?.details?.productionType}`}
                          className="whisky-card__image"
                        />
                        <div className="whisky-card__overlay" />

                      </div>
                      <div className="whisky-card__body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h3 className="whisky-card__title">{item?.details?.producerName}</h3>
                            <p className="whisky-card__reference">{item?.details?.bottlingName}</p>
                            <p className="whisky-card__desc">{item?.details?.storageCondition}</p>
                          </div>
                          <div>
                            {/* <span className="whisky-card__badge">{item?.details?.region}</span> */}
                            <button
                              className={`watch-card__favorite-btn ${isFav ? 'watch-card__favorite-btn--active' : ''}`}
                              onClick={() => handleWishList(item.itemId)}
                              aria-label="Add to wishlist"
                            >
                              <svg viewBox="0 0 24 24" fill={isFav ? '#D4AF37' : 'none'} stroke={isFav ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="whisky-card__meta">
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">DISTILLERY</span>
                            <span className="whisky-card__meta-value">{item?.details?.distilleryStatus}</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">VINTAGE</span>
                            <span className="whisky-card__meta-value">{item?.details?.vintageYear}</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">PRODUCTION TYPE</span>
                            <span className="whisky-card__meta-value">{item?.details?.productionType}</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">AGE</span>
                            <span className="whisky-card__meta-value">{item?.details?.age} Years Aged</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">Strength</span>
                            <span className="whisky-card__meta-value">{item?.details?.proof} % ABV</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">BOTTLE</span>
                            <span className="whisky-card__meta-value">{item?.details?.bottle}</span>
                          </div>
                        </div>
                        <div className="whisky-card__footer">
                          <div className="whisky-card__bid">
                            <span className="whisky-card__bid-label">CURRENT BID</span>
                            <span className="whisky-card__bid-value">{formatCurrency(item?.currentPrice)}</span>
                          </div>
                          <Link
                            to={`/whisky/${item.itemId}`}
                            state={{ item, fromTab: "whisky", fromPage: whiskyPage, whiskyPage, caskPage }}
                            key={item.itemId}
                            className="whisky-card-link"
                          >
                            <span className="whisky-card__cta">{item.canUserBid ? "BID NOW" : "VIEW BIDDING"}</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                  );
                })}
              </div>

              {/* Whisky Pagination */}
              {whiskies?.length > 0 && (
                <div className="whisky-pagination">
                  <button
                    type="button"
                    className="whisky-pagination__btn whisky-pagination__btn--nav"
                    onClick={() => handleWhiskyPageChange(whiskyPage - 1)}
                    disabled={whiskyPage === 1 || whiskyLoading}
                    aria-label="Previous Page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="whisky-pagination__arrow">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <div className="whisky-pagination__pages">
                    {Array.from({ length: Math.max(1, whiskyTotalPages) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`whisky-pagination__btn whisky-pagination__btn--page ${whiskyPage === page ? 'whisky-pagination__btn--active' : ''}`}
                        onClick={() => handleWhiskyPageChange(page)}
                        disabled={whiskyLoading}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="whisky-pagination__btn whisky-pagination__btn--nav"
                    onClick={() => handleWhiskyPageChange(whiskyPage + 1)}
                    disabled={whiskyPage === Math.max(1, whiskyTotalPages) || whiskyLoading}
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="whisky-pagination__arrow">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )
        )}

        {/* ── Tab 2: Cask ── */}
        {activeTab === "cask" && (
          casks.length === 0 ? (
            <div className="listings-empty-state">
              <div className="listings-empty-state__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="listings-empty-state__title">No Cask Lots at the Moment</h3>
              <p className="listings-empty-state__sub">Rare cask opportunities are sourced discreetly. Register your interest or consign your own cask.</p>
              <Link to="/sell" className="listings-empty-state__cta">Submit a Cask</Link>
            </div>
          ) : (
            <>
              <div className="all-whisky-grid">
                {casks?.map((item) => {
                  const isFav = favorites[item.itemId] !== undefined
                    ? favorites[item.itemId]
                    : !!(item.isWishList ?? item.IsWishList);
                  return (
                    <div key={item?.itemId || item?.id} className="whisky-card whisky-card--cask">
                      <div className="whisky-card__cask-ribbon">CASK LOT</div>
                      <div className="whisky-card__image-wrapper">
                        <img src={item?.details?.thumbnail || item?.details?.image1} alt={item?.details?.caskType || 'Cask'} className="whisky-card__image" />
                        <div className="whisky-card__overlay" />
                      </div>
                      <div className="whisky-card__body">
                        <div className="d-flex justify-content-between">
                          <div>
                          <h3 className="whisky-card__title">{item?.details?.distillesy}</h3>
                          <p className="whisky-card__reference">{item?.details?.caskType}</p>
                          {/* <p className="whisky-card__reference">{}</p>z */}
                          <p className="whisky-card__desc">{item?.details?.storageCondition}</p>
                        </div>

                        <div>
                          <button
                            className={`watch-card__favorite-btn ${isFav ? 'watch-card__favorite-btn--active' : ''}`}
                            onClick={() => handleWishList(item.itemId)}
                            aria-label="Add to wishlist"
                          >
                            <svg viewBox="0 0 24 24" fill={isFav ? '#D4AF37' : 'none'} stroke={isFav ? '#D4AF37' : 'currentColor'} strokeWidth="1.5" className="watch-card__heart-icon">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        </div>
                        </div>
                        <div className="whisky-card__meta whisky-card__meta--cask">
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">DISTILLERY</span>
                            <span className="whisky-card__meta-value">{item?.details?.distillesy || '—'}</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">CASK TYPE</span>
                            <span className="whisky-card__meta-value">{item?.details?.caskType || '—'}</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">AYS</span>
                            <span className="whisky-card__meta-value">
                              {item?.details?.ays
                                ? String(item.details.ays).split(/[T\s]/)[0]
                                : "—"}
                            </span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">ABV</span>
                            <span className="whisky-card__meta-value">{item?.details?.abv || '—'} % ABV</span>
                          </div>
                          <div className="whisky-card__meta-item">
                            <span className="whisky-card__meta-label">BOTTLES</span>
                            <span className="whisky-card__meta-value">{item?.details?.noOfBottles || '—'}</span>
                          </div>
                        </div>
                        <div className="whisky-card__footer">
                          <div className="whisky-card__bid">
                            <span className="whisky-card__bid-label">CURRENT BID</span>
                            <span className="whisky-card__bid-value">{formatCurrency(item?.currentPrice)}</span>
                          </div>
                          <Link
                            to={`/cask/${item?.itemId}`}
                            state={{ item, fromTab: "cask", fromPage: caskPage, whiskyPage, caskPage }}
                            key={item?.itemId}
                            className="whisky-card-link"
                          >
                            <span className="whisky-card__cta">{item.canUserBid ? "BID NOW" : "VIEW BIDDING"}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cask Pagination */}
              {casks?.length > 0 && (
                <div className="whisky-pagination">
                  <button
                    type="button"
                    className="whisky-pagination__btn whisky-pagination__btn--nav"
                    onClick={() => handleCaskPageChange(caskPage - 1)}
                    disabled={caskPage === 1 || caskLoading}
                    aria-label="Previous Page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="whisky-pagination__arrow">
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <div className="whisky-pagination__pages">
                    {Array.from({ length: Math.max(1, caskTotalPages) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`whisky-pagination__btn whisky-pagination__btn--page ${caskPage === page ? 'whisky-pagination__btn--active' : ''}`}
                        onClick={() => handleCaskPageChange(page)}
                        disabled={caskLoading}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="whisky-pagination__btn whisky-pagination__btn--nav"
                    onClick={() => handleCaskPageChange(caskPage + 1)}
                    disabled={caskPage === Math.max(1, caskTotalPages) || caskLoading}
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="whisky-pagination__arrow">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
};

export default AllWhisky;
