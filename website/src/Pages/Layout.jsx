import React from 'react'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

function Layout() {
  return (
    <>
      <Navbar />
      <div >
        <Outlet />
      </div >
      <Footer />
    </>
  );
}

export default Layout