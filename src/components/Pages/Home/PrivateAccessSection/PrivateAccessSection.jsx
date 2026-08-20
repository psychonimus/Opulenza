import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../../../Header/Header";
import GoldenButton from "../../../GoldenButton/GoldenButton";
import "./PrivateAccessSection.css";
import { useAuth } from "../../../../services/showUserInfo/ShowUserInfo";
import { registerUser } from "../../../../services/registerService/RegisterService";
import { checkUserEmail } from "../../../../services/getUserData/GetUserData";
import CommonBackdrop from "../../../CommonBackdrop/CommonBackdrop";


const isInviteCodeFilled = (code) => code.join("").trim().length === 10;

export const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const DEFAULT_COUNTRY_CODES = [
  { dialCode: "+1", code: "US", name: "United States", flag: "🇺🇸" },
  { dialCode: "+44", code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { dialCode: "+91", code: "IN", name: "India", flag: "🇮🇳" },
  { dialCode: "+971", code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { dialCode: "+33", code: "FR", name: "France", flag: "🇫🇷" },
  { dialCode: "+49", code: "DE", name: "Germany", flag: "🇩🇪" },
  { dialCode: "+41", code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { dialCode: "+65", code: "SG", name: "Singapore", flag: "🇸🇬" },
  { dialCode: "+81", code: "JP", name: "Japan", flag: "🇯🇵" },
  { dialCode: "+61", code: "AU", name: "Australia", flag: "🇦🇺" },
  { dialCode: "+966", code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { dialCode: "+974", code: "QA", name: "Qatar", flag: "🇶🇦" },
  { dialCode: "+39", code: "IT", name: "Italy", flag: "🇮🇹" },
  { dialCode: "+852", code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { dialCode: "+86", code: "CN", name: "China", flag: "🇨🇳" },
  { dialCode: "+1", code: "CA", name: "Canada", flag: "🇨🇦" },
];

const SearchableCountrySelect = ({ countries, selectedDialCode, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selectedCountry = countries.find(
    (c) => c.dialCode === selectedDialCode,
  ) ||
    countries[0] || {
    dialCode: "+1",
    code: "US",
    name: "United States",
    flag: "🇺🇸",
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.toLowerCase().includes(q)
    );
  });



  return (
    <div className="pa-country-picker" ref={dropdownRef}>
      <button
        type="button"
        className="pa-country-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="pa-country-flag">{selectedCountry.flag}</span>
        <span className="pa-country-code-val">{selectedCountry.dialCode}</span>
        <svg
          className={`pa-country-chevron ${isOpen ? "is-open" : ""}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1 1 5 5 9 1" />
        </svg>
      </button>

      {isOpen && (
        <div className="pa-country-dropdown">
          <div className="pa-country-search-box">
            <input
              type="text"
              className="pa-country-search-input"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="pa-country-list">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c, idx) => (
                <div
                  key={`${c.code}-${c.dialCode}-${idx}`}
                  className={`pa-country-item ${c.dialCode === selectedDialCode ? "is-selected" : ""
                    }`}
                  onClick={() => {
                    onSelect(c.dialCode);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="pa-item-flag">{c.flag}</span>
                  <span className="pa-item-name">{c.name}</span>
                  <span className="pa-item-dial">{c.dialCode}</span>
                </div>
              ))
            ) : (
              <div className="pa-country-no-results">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const maskMobileNumber = (val) => {
  if (!val) return "";
  const chars = val.split("");
  return chars
    .map((ch, idx) => {
      // 1-indexed 3rd, 4th, 7th, 8th correspond to 0-indexed 2, 3, 6, 7
      if ([2, 3, 6, 7].includes(idx)) {
        return "*";
      }
      return ch;
    })
    .join("");
};

const updateRawPhone = (oldRaw, newDisplayVal) => {
  let result = "";
  let oldIdx = 0;
  for (let i = 0; i < newDisplayVal.length; i++) {
    const char = newDisplayVal[i];
    if (char === "*") {
      if (oldIdx < oldRaw.length && /\d/.test(oldRaw[oldIdx])) {
        result += oldRaw[oldIdx];
      }
      oldIdx++;
    } else if (/\d/.test(char)) {
      result += char;
      oldIdx++;
    }
  }
  return result;
};

const registrationSchema = yup.object().shape({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  displayName: yup
    .string()
    .trim()
    .required("Username / Display name is required"),
  primaryEmail: yup
    .string()
    .trim()
    .email("Must be a valid email address")
    .required("Primary email is required"),
  secondaryEmail: yup
    .string()
    .trim()
    .notRequired()
    .test(
      "is-valid-email",
      "Must be a valid email address",
      (val) => !val || yup.string().email().isValidSync(val),
    ),
  primaryMobile: yup
    .string()
    .trim()
    .required("Primary phone number is required")
    .min(7, "Primary phone number must be valid"),
  secondaryMobile: yup.string().trim().notRequired(),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  familyOfficeName: yup.string().trim().notRequired(),
  companyName: yup.string().trim().notRequired(),
  website: yup.string().trim().notRequired(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const RegistrationModal = ({
  inviteCode,
  onSuccess,
  onClose,
  loginData,
  setLoginData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [primaryCountryCode, setPrimaryCountryCode] = useState("+1");
  const [secondaryCountryCode, setSecondaryCountryCode] = useState("+1");
  const [countryCodes, setCountryCodes] = useState(DEFAULT_COUNTRY_CODES);

  useEffect(() => {
    let isMounted = true;
    fetch("https://countriesnow.space/api/v0.1/countries/codes")
      .then((res) => res.json())
      .then((resData) => {
        if (
          isMounted &&
          resData &&
          !resData.error &&
          Array.isArray(resData.data)
        ) {
          const formatted = resData.data
            .filter((c) => c.dial_code && c.code)
            .map((c) => {
              const codeClean = c.code.trim().toUpperCase();
              return {
                dialCode: c.dial_code.trim(),
                code: codeClean,
                name: c.name.trim(),
                flag: getFlagEmoji(codeClean),
              };
            });
          if (formatted.length > 0) {
            setCountryCodes(formatted);
          }
        }
      })
      .catch((err) => {
        console.warn("Using fallback country codes:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      firstName: loginData?.details?.name,
      lastName: "",
      displayName: "",
      primaryEmail: loginData?.details?.inviteTo,
      secondaryEmail: "",
      primaryMobile: "",
      secondaryMobile: "",
      dateOfBirth: "",
      gender: "",
      familyOfficeName: "",
      companyName: "",
      website: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleCloseModal = () => {
    reset();
    setError("");
    onClose();
  };

  const handleRegister = async (data) => {
    setError("");
    setLoading(true);

    const formattedPrimaryMobile = `${primaryCountryCode} ${data.primaryMobile}`;
    const formattedSecondaryMobile = data.secondaryMobile
      ? `${secondaryCountryCode} ${data.secondaryMobile}`
      : "";

    const payload = {
      ...data,
      primaryMobile: formattedPrimaryMobile,
      secondaryMobile: formattedSecondaryMobile,
      invitationCode: inviteCode,
      oP_MemberInvitations_Id: loginData?.details?.invitationID,
      membershipTypeID: 1,
      nationalityID: 0,
    };

    try {
      await registerUser(payload);
      reset();
      setPrimaryCountryCode("+1");
      setSecondaryCountryCode("+1");
      onSuccess();
      setLoginData(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CommonBackdrop label="Creating account" />}
      <div className="pa-modal-overlay">
        <div className="pa-modal-card pa-reg-card" data-lenis-prevent="scroll">
          <button
            className="pa-modal-close"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="pa-modal-header">
            <span className="pa-modal-eyebrow">— INVITATION ACCEPTED —</span>
            <h2 className="pa-modal-title">
              Complete your <em>profile.</em>
            </h2>
            <p className="pa-modal-sub">
              You have been granted exclusive access. Introduce yourself.
            </p>
          </div>

          <div className="pa-modal-divider" />

          <form
            className="pa-modal-form"
            onSubmit={handleSubmit(handleRegister)}
          >
            {/* Row 1 */}
            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">FIRST NAME *</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Jonathan"
                  {...register("firstName")}
                  autoFocus
                />
                {errors.firstName && (
                  <span className="pa-field-error">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">LAST NAME *</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Smith"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <span className="pa-field-error">
                    {errors.lastName.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">
                  USERNAME / DISPLAY NAME *
                </label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="j.ashford"
                  {...register("displayName")}
                />
                {errors.displayName && (
                  <span className="pa-field-error">
                    {errors.displayName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">PRIMARY EMAIL *</label>
                <input
                  type="email"
                  className="pa-field-input"
                  placeholder="member@private.com"
                  {...register("primaryEmail")}
                  onChange={(e) => {
                    setValue("primaryEmail", e.target.value.toLowerCase(), {
                      shouldValidate: true,
                    });
                  }}
                />
                {errors.primaryEmail && (
                  <span className="pa-field-error">
                    {errors.primaryEmail.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">
                  SECONDARY EMAIL (OPTIONAL)
                </label>
                <input
                  type="email"
                  className="pa-field-input"
                  placeholder="member@private.com"
                  {...register("secondaryEmail")}
                  onChange={(e) => {
                    setValue("secondaryEmail", e.target.value.toLowerCase(), {
                      shouldValidate: true,
                    });
                  }}
                />
                {errors.secondaryEmail && (
                  <span className="pa-field-error">
                    {errors.secondaryEmail.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">GENDER *</label>
                <select className="pa-field-input" {...register("gender")}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <span className="pa-field-error">
                    {errors.gender.message}
                  </span>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">PRIMARY PHONE *</label>
                <div className="pa-phone-wrapper">
                  <SearchableCountrySelect
                    countries={countryCodes}
                    selectedDialCode={primaryCountryCode}
                    onSelect={(code) => setPrimaryCountryCode(code)}
                  />
                  <input
                    type="text"
                    className="pa-field-input"
                    placeholder="0000000000"
                    value={maskMobileNumber(watch("primaryMobile") || "")}
                    onChange={(e) => {
                      const raw = updateRawPhone(
                        watch("primaryMobile") || "",
                        e.target.value,
                      );
                      setValue("primaryMobile", raw, { shouldValidate: true });
                    }}
                  />
                </div>
                {errors.primaryMobile && (
                  <span className="pa-field-error">
                    {errors.primaryMobile.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">
                  SECONDARY PHONE (OPTIONAL)
                </label>
                <div className="pa-phone-wrapper">
                  <SearchableCountrySelect
                    countries={countryCodes}
                    selectedDialCode={secondaryCountryCode}
                    onSelect={(code) => setSecondaryCountryCode(code)}
                  />
                  <input
                    type="text"
                    className="pa-field-input"
                    placeholder="0000000000"
                    value={maskMobileNumber(watch("secondaryMobile") || "")}
                    onChange={(e) => {
                      const raw = updateRawPhone(
                        watch("secondaryMobile") || "",
                        e.target.value,
                      );
                      setValue("secondaryMobile", raw, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </div>
                {errors.secondaryMobile && (
                  <span className="pa-field-error">
                    {errors.secondaryMobile.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">DATE OF BIRTH *</label>
                <input
                  type="date"
                  className="pa-field-input"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <span className="pa-field-error">
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </div>
            </div>

            {/* Row 4 */}
            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">
                  COMPANY NAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter company name"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <span className="pa-field-error">
                    {errors.companyName.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">
                  FAMILY OFFICE NAME (OPTIONAL)
                </label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter family office name"
                  {...register("familyOfficeName")}
                />
                {errors.familyOfficeName && (
                  <span className="pa-field-error">
                    {errors.familyOfficeName.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">WEBSITE (OPTIONAL)</label>
                <input
                  type="text"
                  className="pa-field-input"
                  placeholder="Enter website"
                  {...register("website")}
                />
                {errors.website && (
                  <span className="pa-field-error">
                    {errors.website.message}
                  </span>
                )}
              </div>
            </div>

            {/* Row 5 */}
            <div className="pa-reg-row">
              <div className="pa-field">
                <label className="pa-field-label">PASSWORD *</label>
                <div className="pa-password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="pa-field-input"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="pa-password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="pa-field-error">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className="pa-field">
                <label className="pa-field-label">CONFIRM PASSWORD *</label>
                <div className="pa-password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="pa-field-input"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="pa-password-toggle-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="pa-field-error">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <div className="pa-invite-badge">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>
                INVITE CODE: <strong>{inviteCode}</strong>
              </span>
            </div>

            {error && <p className="pa-error-msg">{error}</p>}

            <button type="submit" className="pa-submit-btn" disabled={loading}>
              {loading ? "REGISTERING..." : "CREATE MY ACCOUNT"}
            </button>
          </form>

          <div className="pa-modal-footer">
            <span className="pa-footer-line" />
            <span className="pa-footer-text">END-TO-END ENCRYPTED</span>
            <span className="pa-footer-line" />
          </div>
        </div>
      </div>
    </>
  );
};

const PrivateAccessSection = () => {
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [pendingInviteCode, setPending] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState([
    "O",
    "P",
    "I",
    "-",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const [proceedLoading, setProceedLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginStep, setLoginStep] = useState("email");
  const [loginData, setLoginData] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const codeRefs = Array.from({ length: 10 }, () => useRef(null));

  useEffect(() => {
    // Escape key intentionally disabled — modal closes via the close button only
  }, [showModal]);

  const handleCodeChange = (idx, val) => {
    if (idx < 4) return;
    if (val.length > 1) return;
    if (val && !/^\d$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 9) codeRefs[idx + 1].current?.focus();
  };

  const handleCodeKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 4) {
      codeRefs[idx - 1].current?.focus();
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setProceedLoading(true);

    checkUserEmail(email)
      .then((res) => {
        setRequiresPassword(res?.data?.data);
        setLoginStep(res?.data?.data ? "password" : "invite");
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid credentials. Please try again.";
        setError(msg);
      })
      .finally(() => {
        setProceedLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const filledCode = code.join("");
    const usingInvite = isInviteCodeFilled(code);

    const credentials = {
      userName: email,
      password: loginStep === "password" ? password : undefined,
      invitationCode: loginStep === "invite" ? filledCode : undefined,
      _inviteMode: usingInvite,
    };

    login(credentials)
      .then(({ tokenData }) => {
        setLoginData(tokenData);
        setShowModal(false);

        if (usingInvite) {
          setPending(filledCode);
          setShowRegModal(true);
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Invalid credentials. Please try again.";
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseLoginModal = () => {
    setShowModal(false);
    setLoginStep("email");
    setEmail("");
    setPassword("");
    setCode(["O", "P", "I", "-", "", "", "", "", "", ""]);
    setError("");
  };

  const handleRegistrationSuccess = () => {
    setShowRegModal(false);
  };

  return (
    <>
      {(loading || proceedLoading) && (
        <CommonBackdrop label={proceedLoading ? "Verifying" : "Signing in"} />
      )}
      <section className="private-access-section">
        <div className="container">
          <div className="text-center">
            <Header
              topText="Private Access"
              mainText="Not everything exceptional is"
              highlight="meant to be seen"
              center={true}
              eyebrow={true}
            />
          </div>
          <div className="text-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
            >
              <GoldenButton text="Login" link="#" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Login Modal ──────────────────────────────────────── */}
      {showModal && (
        <div className="pa-modal-overlay">
          <div className="pa-modal-card">
            <button
              className="pa-modal-close"
              onClick={handleCloseLoginModal}
              aria-label="Close"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* <div className="pa-modal-header">
              <span className="pa-modal-eyebrow">— THE THRESHOLD —</span>
              <h2 className="pa-modal-title">Identify <em>yourself.</em></h2>
              <p className="pa-modal-sub">Members proceed in silence.</p>
            </div> */}

            <div className="pa-modal-divider" />

            {/* ── Step 1: Email only ── */}
            {loginStep === "email" && (
              <form className="pa-modal-form" onSubmit={handleProceed}>
                <div className="pa-field">
                  <label className="pa-field-label">MEMBER ID / EMAIL</label>
                  <input
                    type="email"
                    className="pa-field-input"
                    placeholder="member@private"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                    autoFocus
                  />
                </div>

                {error && <p className="pa-error-msg">{error}</p>}

                <button type="submit" className="pa-submit-btn">
                  PROCEED
                </button>
              </form>
            )}

            {/* ── Step 2: Password ── */}
            {loginStep === "password" && (
              <form className="pa-modal-form" onSubmit={handleSubmit}>
                <button
                  type="button"
                  className="pa-back-btn"
                  onClick={() => {
                    setError("");
                    setPassword("");
                    setLoginStep("email");
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>

                <div className="pa-field pa-field--locked">
                  <label className="pa-field-label">MEMBER ID / EMAIL</label>
                  <div className="pa-field-locked-val">{email}</div>
                </div>

                <div className="pa-field">
                  <label className="pa-field-label">PASSWORD</label>
                  <input
                    type="password"
                    className="pa-field-input"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && <p className="pa-error-msg">{error}</p>}

                <button
                  type="submit"
                  className="pa-submit-btn"
                  disabled={loading}
                >
                  {loading ? "VERIFYING..." : "LOGIN"}
                </button>

                <button
                  type="button"
                  className="pa-invite-toggle-btn"
                  onClick={() => {
                    setError("");
                    setLoginStep("invite");
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Login with invite code instead
                </button>
              </form>
            )}

            {/* ── Step 3: Invite Code ── */}
            {loginStep === "invite" && (
              <form className="pa-modal-form" onSubmit={handleSubmit}>
                <button
                  type="button"
                  className="pa-back-btn"
                  onClick={() => {
                    setError("");
                    setCode(["O", "P", "I", "-", "", "", "", "", "", ""]);
                    setLoginStep("email");
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>

                <div className="pa-field pa-field--locked">
                  <label className="pa-field-label">MEMBER ID / EMAIL</label>
                  <div className="pa-field-locked-val">{email}</div>
                </div>

                <div className="pa-field">
                  <label className="pa-field-label">PRIVATE ACCESS CODE</label>
                  <div className="pa-code-row">
                    {code.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={codeRefs[idx]}
                        type="text"
                        inputMode="text"
                        maxLength={1}
                        className={`pa-code-input${idx < 4 ? " pa-code-input--prefix" : ""}`}
                        value={digit}
                        readOnly={idx < 4}
                        onChange={(e) => handleCodeChange(idx, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                        onFocus={
                          idx < 4
                            ? () => codeRefs[4].current?.focus()
                            : undefined
                        }
                      />
                    ))}
                  </div>
                  <div className="pa-code-underline" />
                  {isInviteCodeFilled(code) && (
                    <p className="pa-code-hint">
                      ✦ Invite code detected — you'll complete registration
                      after verification.
                    </p>
                  )}
                </div>

                {error && <p className="pa-error-msg">{error}</p>}

                <button
                  type="submit"
                  className="pa-submit-btn"
                  disabled={loading}
                >
                  {loading ? "VERIFYING..." : "LOGIN"}
                </button>

                <button
                  type="button"
                  className="pa-invite-toggle-btn"
                  onClick={() => {
                    setError("");
                    setCode(Array(10).fill(""));
                    setLoginStep("password");
                  }}
                >
                  ← Use password instead
                </button>
              </form>
            )}

            {/* <div className="pa-modal-footer">
              <span className="pa-footer-line" />
              <span className="pa-footer-text">END-TO-END ENCRYPTED</span>
              <span className="pa-footer-line" />
            </div> */}
          </div>
        </div>
      )}

      {/* ── Registration Modal (invite-code flow) ────────────── */}
      {showRegModal && (
        <RegistrationModal
          inviteCode={pendingInviteCode}
          onSuccess={handleRegistrationSuccess}
          onClose={() => setShowRegModal(false)}
          loginData={loginData}
          setLoginData={setLoginData}
        />
      )}
    </>
  );
};

export default PrivateAccessSection;
