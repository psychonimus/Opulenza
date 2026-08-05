import { createContext, useCallback, useContext, useState } from 'react'

const BackdropContext = createContext(null)

export const BackdropProvider = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState('Loading')

  const showBackdrop = useCallback((text = 'Loading') => {
    setLabel(text)
    setVisible(true)
  }, [])

  const hideBackdrop = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <BackdropContext.Provider value={{ visible, label, showBackdrop, hideBackdrop }}>
      {children}
    </BackdropContext.Provider>
  )
}

export const useBackdrop = () => {
  const ctx = useContext(BackdropContext)
  if (!ctx) throw new Error('useBackdrop must be used inside <BackdropProvider>')
  return ctx
}
