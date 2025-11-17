import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

