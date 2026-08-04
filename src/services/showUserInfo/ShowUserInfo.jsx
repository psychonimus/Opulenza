import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../../http-common'

// ── Raw API call (kept for backward-compat if needed elsewhere) ───────────────
export const showUserData = () => api.get('/api/member/Me')

// ── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    showUserData()
      .then((res) => {
        const user = res?.data?.data ?? res?.data ?? null
        setUserInfo(user)
      })
      .catch(() => {
        setUserInfo(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <UserContext.Provider value={{ userInfo, loading, setUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useUser = () => useContext(UserContext)
