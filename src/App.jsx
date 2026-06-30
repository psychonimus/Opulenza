import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Pages/Home/Home'
import Footer from './components/Footer/Footer'
import Concierge from './components/Pages/concierge/Concierge'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BidPage from './components/Pages/BidPage/BidPage'
import WatchListing from './components/Pages/WatchListings/WatchListing'
import DetailedPage from './components/Pages/WatchListings/DetailedPage/DetailedPage'
import SellPage from './components/Pages/SellPage/SellPage'
import WhiskyListings from './components/Pages/WhiskyLisitngs/WhiskyListings'
import ProfilePage from './components/Pages/ProfilePage/ProfilePage'
import About from './components/Pages/AboutPage/About'
import DetailedWhiskyPage from './components/Pages/WhiskyLisitngs/DetailedWhiskyPage/Whisky'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import { useEffect } from 'react'
import Lenis from 'lenis'
import CigarListings from './components/Pages/CigarListings/CigarListings'


const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/concierge' element={<Concierge />} />
        <Route path='/bidPage' element={<BidPage />} />
        <Route path='/watchListing' element={<WatchListing />} />
        <Route path='/watch/:id' element={<DetailedPage />} />
        <Route path='/sell' element={<SellPage />} />
        <Route path='/whiskyListings' element={<WhiskyListings />} />
        <Route path='/whisky/:id' element={<DetailedWhiskyPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/cigarsListings' element={<CigarListings />} />
        


      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App