import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import style from "./Layout.module.css";

import ScrollToTopButton from "../components/ScrollToTop/ScrollTopButton";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";


const Layout = () => {
  return (
    <div className={style.layoutMainContainer}>
      {/* 🔥 ROUTE CHANGE FIX */}
      <ScrollToTop />
      <Header />

      <div className={style.pageContent}>
        <Outlet />
      </div>

      <Footer />
      <ScrollToTopButton /> {/* 🔥 BUTTON */}
    </div>
  );
};

export default Layout;
