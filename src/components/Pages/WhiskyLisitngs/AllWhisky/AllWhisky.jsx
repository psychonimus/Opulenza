import React, { useState } from "react";
import { Link } from "react-router-dom";
import whiskyData, { CaskData } from "../../../../data/WhiskyData";
import "./AllWhisky.css";

const AllWhisky = () => {
  const [activeTab, setActiveTab] = useState("whisky");

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
            onClick={() => setActiveTab("whisky")}
          >
            Whisky
          </button>
          <button
            type="button"
            id="tab-cask"
            className={`aw-tab-btn${activeTab === "cask" ? " aw-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("cask")}
          >
            Cask
          </button>
        </div>

        {/* ── Tab 1: Whisky ── */}
        {activeTab === "whisky" && (
          whiskyData.length === 0 ? (
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
          <div className="all-whisky-grid">
            {whiskyData.map((item) => {
              const distillery =
                item.details?.find((d) => d.label === "DISTILLERY")?.value ||
                item.title;
              const distilled =
                item.details?.find((d) => d.label === "DISTILLED")?.value ||
                "—";
              const cask =
                item.details?.find((d) => d.label === "CASK")?.value || "—";
              const rarity =
                item.details?.find((d) => d.label === "RARITY")?.value || "—";

              return (
                <Link
                  to={`/whisky/${item.id}`}
                  key={item.id}
                  className="whisky-card-link"
                >
                  <div className="whisky-card">
                    <div className="whisky-card__image-wrapper">
                      <img
                        src={item.image}
                        alt={`${item.title} ${item.reference}`}
                        className="whisky-card__image"
                      />
                      <div className="whisky-card__overlay" />
                      <span className="whisky-card__badge">{item.badge}</span>
                    </div>
                    <div className="whisky-card__body">
                      <h3 className="whisky-card__title">{item.title}</h3>
                      <p className="whisky-card__reference">{item.reference}</p>
                      <p className="whisky-card__desc">{item.description}</p>
                      <div className="whisky-card__meta">
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">DISTILLERY</span>
                          <span className="whisky-card__meta-value">{distillery}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">DISTILLED</span>
                          <span className="whisky-card__meta-value">{distilled}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">CASK</span>
                          <span className="whisky-card__meta-value">{cask}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">RARITY</span>
                          <span className="whisky-card__meta-value">{rarity}</span>
                        </div>
                      </div>
                      <div className="whisky-card__footer">
                        <div className="whisky-card__bid">
                          <span className="whisky-card__bid-label">CURRENT BID</span>
                          <span className="whisky-card__bid-value">{item.currentBid}</span>
                        </div>
                        <span className="whisky-card__cta">BID NOW →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          )
        )}

        {/* ── Tab 2: Cask ── */}
        {activeTab === "cask" && (
          CaskData.length === 0 ? (
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
          <div className="all-whisky-grid">
            {CaskData.map((item) => {
              const distillery =
                item.details?.find((d) => d.label === "DISTILLERY")?.value ||
                item.title;
              const caskType =
                item.details?.find((d) => d.label === "CASK TYPE")?.value || "—";
              const age = item.details?.find((d) => d.label === "AGE")?.value || "—";
              const abv = item.details?.find((d) => d.label === "ABV")?.value || "—";
              const volume = item.details?.find((d) => d.label === "VOLUME")?.value || "—";
              const bottles = item.details?.find((d) => d.label === "BOTTLES")?.value || "—";

              return (
                <div key={item.id} className="whisky-card-link">
                  <div className="whisky-card whisky-card--cask">
                    <div className="whisky-card__cask-ribbon">CASK LOT</div>
                    <div className="whisky-card__image-wrapper">
                      <img src={item.image} alt={item.title} className="whisky-card__image" />
                      <div className="whisky-card__overlay" />
                    </div>
                    <div className="whisky-card__body">
                      <h3 className="whisky-card__title">{item.title}</h3>
                      <p className="whisky-card__reference">{item.reference}</p>
                      <p className="whisky-card__desc">{item.description}</p>
                      <div className="whisky-card__meta whisky-card__meta--cask">
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">DISTILLERY</span>
                          <span className="whisky-card__meta-value">{distillery}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">CASK TYPE</span>
                          <span className="whisky-card__meta-value">{caskType}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">AGE</span>
                          <span className="whisky-card__meta-value">{age}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">ABV</span>
                          <span className="whisky-card__meta-value">{abv}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">VOLUME</span>
                          <span className="whisky-card__meta-value">{volume}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">BOTTLES</span>
                          <span className="whisky-card__meta-value">{bottles}</span>
                        </div>
                      </div>
                      <div className="whisky-card__footer">
                        <div className="whisky-card__bid">
                          <span className="whisky-card__bid-label">EST. CASK VALUE</span>
                          <span className="whisky-card__bid-value">{item.currentBid}</span>
                        </div>
                        <span className="whisky-card__cta">ENQUIRE →</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )
        )}
      </div>
    </section>
  );
};

export default AllWhisky;
