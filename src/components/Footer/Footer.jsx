import React from "react";
import { Link } from "react-router-dom";
import style from "./Footer.module.css";

import { SlSocialFacebook } from "react-icons/sl";
import { IoLogoInstagram, IoLocationOutline, IoCallSharp } from "react-icons/io5";
import { MdMarkEmailRead } from "react-icons/md";
import { FaThreads } from "react-icons/fa6";


const Footer = () => {

  // ✅ QUICK LINKS (sirf text + path)
  const Links = [
    { text: "About Us", path: "/app/about" },
    { text: "How It Works", path: "/app/how-it-works" },
    { text: "Trade Assurance", path: "/app/trade-assurance" },
    // { text: "Success Stories", path: "/app/success-stories" },
    // { text: "Press & Media", path: "/app/press" },
    // { text: "Careers", path: "/app/careers" },
  ];

  const policy = [
    { text: "Privacy Policy", path: "/app/privacy-policy" },
    { text: "Terms of Services", path: "/app/terms" },
    // { text: "Cookies", path: "/app/cookies" },
  ];

  return (
    <main className={style.mainContainer}>
      <div className={style.mainFooter}>

        {/* BRAND SECTION */}
        <section className={style.linkSection}>
          <div className={style.brandLogo}>
            <div className={style.brandMain}>Mojija E Commerce</div>



          </div>

          <div className={style.tagline}>B2B & B2C MARKET PLACE</div>

          <p>
            Empowering businesses with seamless B2B trade solutions, secure
            payments, and trusted partnerships. Connect with verified suppliers
            and grow globally.
          </p>

          <div className={style.linkIcons}>
            <a
              href="https://www.facebook.com/profile.php?id=61584609989029"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SlSocialFacebook className={style.icons} />
            </a>

            <a
              href="https://www.instagram.com/mojija_ecommerce/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoInstagram className={style.icons} />
            </a>

            <a
              href="https://www.threads.com/@mojija_ecommerce?xmt=AQF0R7p1xIMyHoEVF2cSfBFwqFilmsDVmlLSS6HzTZgQfaY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaThreads className={style.icons} />
            </a>
          </div>
        </section>

        {/* QUICK LINKS */}
        <section className={style.aboutSection}>
          <h2>Quick Links</h2>
          {Links.map((item, index) => (
            <Link key={index} to={item.path}>
              <p>{item.text}</p>
            </Link>
          ))}
        </section>

        {/* CONTACT */}
        <section className={style.contectSection}>
          <h2>Contact Us</h2>

          <div className={style.contact}>
            <IoLocationOutline />
            <span>Greater Noida , Uttar Pradesh, India</span>
          </div>

          <a href="tel:+91 92058 03705" className={style.contact}>
            <IoCallSharp />
            <span>+91 92058 03705</span>
          </a>

          <a href="mailto:support@emojija.com" className={style.contact}>
            <MdMarkEmailRead />
            <span>support@mojija.com</span>
          </a>
        </section>

      </div>

      <hr className={style.line} />

      {/* BOTTOM SECTION */}
      <section className={style.lastSection}>
        <span>© 2025 mojija.com. All rights reserved</span>

        <div className={style.policy}>
          {policy.map((item, index) => (
            <Link key={index} to={item.path}>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Footer;
