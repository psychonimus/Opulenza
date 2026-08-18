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
                          <span className="whisky-card__meta-label">
                            DISTILLERY
                          </span>
                          <span className="whisky-card__meta-value">
                            {distillery}
                          </span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">
                            DISTILLED
                          </span>
                          <span className="whisky-card__meta-value">
                            {distilled}
                          </span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">CASK</span>
                          <span className="whisky-card__meta-value">{cask}</span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">
                            RARITY
                          </span>
                          <span className="whisky-card__meta-value">
                            {rarity}
                          </span>
                        </div>
                      </div>
                      <div className="whisky-card__footer">
                        <div className="whisky-card__bid">
                          <span className="whisky-card__bid-label">
                            CURRENT BID
                          </span>
                          <span className="whisky-card__bid-value">
                            {item.currentBid}
                          </span>
                        </div>
                        <span className="whisky-card__cta">BID NOW →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Tab 2: Cask ── */}
        {activeTab === "cask" && (
          <div className="all-whisky-grid">
            {CaskData.map((item) => {
              const distillery =
                item.details?.find((d) => d.label === "DISTILLERY")?.value ||
                item.title;
              const caskType =
                item.details?.find((d) => d.label === "CASK TYPE")?.value ||
                "—";
              const age =
                item.details?.find((d) => d.label === "AGE")?.value || "—";
              const abv =
                item.details?.find((d) => d.label === "ABV")?.value || "—";
              const volume =
                item.details?.find((d) => d.label === "VOLUME")?.value || "—";
              const bottles =
                item.details?.find((d) => d.label === "BOTTLES")?.value || "—";

              return (
                <div key={item.id} className="whisky-card-link">
                  <div className="whisky-card whisky-card--cask">
                    {/* Cask badge ribbon */}
                    <div className="whisky-card__cask-ribbon">CASK LOT</div>
                    <div className="whisky-card__image-wrapper">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="whisky-card__image"
                      />
                      <div className="whisky-card__overlay" />
                    </div>
                    <div className="whisky-card__body">
                      <h3 className="whisky-card__title">{item.title}</h3>
                      <p className="whisky-card__reference">{item.reference}</p>
                      <p className="whisky-card__desc">{item.description}</p>
                      <div className="whisky-card__meta whisky-card__meta--cask">
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">
                            DISTILLERY
                          </span>
                          <span className="whisky-card__meta-value">
                            {distillery}
                          </span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">
                            CASK TYPE
                          </span>
                          <span className="whisky-card__meta-value">
                            {caskType}
                          </span>
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
                          <span className="whisky-card__meta-label">
                            VOLUME
                          </span>
                          <span className="whisky-card__meta-value">
                            {volume}
                          </span>
                        </div>
                        <div className="whisky-card__meta-item">
                          <span className="whisky-card__meta-label">
                            BOTTLES
                          </span>
                          <span className="whisky-card__meta-value">
                            {bottles}
                          </span>
                        </div>
                      </div>
                      <div className="whisky-card__footer">
                        <div className="whisky-card__bid">
                          <span className="whisky-card__bid-label">
                            EST. CASK VALUE
                          </span>
                          <span className="whisky-card__bid-value">
                            {item.currentBid}
                          </span>
                        </div>
                        <span className="whisky-card__cta">ENQUIRE →</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllWhisky;
