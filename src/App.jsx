import Lenis from "lenis";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useBackdrop } from "./components/CommonBackdrop/BackdropContext";
import CommonBackdrop from "./components/CommonBackdrop/CommonBackdrop";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/Pages/AboutPage/About";
import AdminPanel from "./components/Pages/AdminPanel/AdminPanel";
import BidPage from "./components/Pages/BidPage/BidPage";
import CigarListings from "./components/Pages/CigarListings/CigarListings";
import DetailedCigarPage from "./components/Pages/CigarListings/DetailedCigarPage/DetailedCigarPage";
import Concierge from "./components/Pages/concierge/Concierge";
import Explore from "./components/Pages/Explore/Explore";
import Home from "./components/Pages/Home/Home";
import DetailedPenPage from "./components/Pages/PensListings/DetailedPenPage/DetailedPenPage";
import PenListings from "./components/Pages/PensListings/PenListings";
import ProfilePage from "./components/Pages/ProfilePage/ProfilePage";
import SellPage from "./components/Pages/SellPage/SellPage";
import TermsPage from "./components/Pages/TermsPage/TermsPage";
import VaultPage from "./components/Pages/VaultPage/VaultPage";
import DetailedPage from "./components/Pages/WatchListings/DetailedPage/DetailedPage";
import WatchListing from "./components/Pages/WatchListings/WatchListing";
import DetailedWhiskyPage from "./components/Pages/WhiskyLisitngs/DetailedWhiskyPage/Whisky";
import WhiskyListings from "./components/Pages/WhiskyLisitngs/WhiskyListings";
import DetailedYachtPage from "./components/Pages/YachtListings/DetailedYachtPage/DetailedYachtPage";
import YachtListings from "./components/Pages/YachtListings/YachtListings";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { AUTH_STATUS, useAuth } from "./services/showUserInfo/ShowUserInfo";

const ProtectedRoute = ({ children }) => {
  const { status } = useAuth();

  if (status === AUTH_STATUS.INITIALIZING) {
    return null;
  }

  if (status === AUTH_STATUS.UNAUTHENTICATED) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { status, user } = useAuth();

  if (status === AUTH_STATUS.INITIALIZING) return null;

  if (status === AUTH_STATUS.UNAUTHENTICATED) {
    return <Navigate to="/" replace />;
  }

  return user?.role === "SuperAdmin" ? children : <Navigate to="/" replace />;
};

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route
          path="/concierge"
          element={
            <ProtectedRoute>
              <Concierge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bidPage"
          element={
            <ProtectedRoute>
              <BidPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchListing"
          element={
            <ProtectedRoute>
              <WatchListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/:id"
          element={
            <ProtectedRoute>
              <DetailedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/whiskyListings"
          element={
            <ProtectedRoute>
              <WhiskyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/whisky/:id"
          element={
            <ProtectedRoute>
              <DetailedWhiskyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cigarsListings"
          element={
            <ProtectedRoute>
              <CigarListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cigar/:id"
          element={
            <ProtectedRoute>
              <DetailedCigarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/penListings"
          element={
            <ProtectedRoute>
              <PenListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pen/:id"
          element={
            <ProtectedRoute>
              <DetailedPenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yachtListings"
          element={
            <ProtectedRoute>
              <YachtListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/yacht/:id"
          element={
            <ProtectedRoute>
              <DetailedYachtPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vault"
          element={
            <ProtectedRoute>
              <VaultPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const { status } = useAuth();
  const { visible, label } = useBackdrop();

  return (
    <>
      {status === AUTH_STATUS.INITIALIZING && (
        <CommonBackdrop label="Authenticating" />
      )}
      {visible && <CommonBackdrop label={label} />}
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </>
  );
};

export default App;
