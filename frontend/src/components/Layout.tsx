
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 pt-24 pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
