

import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import style from "./Navbar.module.css";
import { GrCart } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../../store/APi/axiosInstance";  // ← Your dual-backend axios

/* 🔥 HELPER: USER INITIALS */
const getInitials = (name = "") => {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (
        parts[0].charAt(0).toUpperCase() +
        parts[parts.length - 1].charAt(0).toUpperCase()
    );
};

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const hideNavbarRoutes = [
        "/seller/login",
        "/seller/register",
        "/seller/seller-forget-password",
        "/seller/verify-otp",
        "/seller/reset-password",
    ];
    if (hideNavbarRoutes.includes(location.pathname)) return null;

    const [user, setUser] = useState({ username: "Business User" });
    const [isOpen, setOpen] = useState(false);

    /* ================= SEARCH ================= */
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const [loading, setLoading] = useState(false);

    const debounceRef = useRef(null);
    const searchRef = useRef(null);

    const cartItems = useSelector((state) => state.cart.items);
    const cartCount = cartItems.reduce((a, b) => a + b.quantity, 0);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await api.get("/auth/me");

                const username = res.data?.user?.username || "Business User";

                const userObj = { username };

                setUser(userObj);
                localStorage.setItem("user", JSON.stringify(userObj));
            } catch (err) {
                console.warn("Navbar user load failed");
            }
        };

        loadUser();
    }, []);


    /* ================= SEARCH ================= */
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);

        if (!val.trim()) {
            setShowSuggest(false);
            setSuggestions([]);
            return;
        }

        setShowSuggest(true);
        setLoading(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await api.get(
                    `/public/buyer/search?query=${encodeURIComponent(val)}`
                );

                setSuggestions(res.data.products || []);
            } catch (err) {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };


    const handleSearch = (text = search) => {
        if (!text.trim()) return;
        navigate(`/app/allproducts?search=${encodeURIComponent(text)}`);
        setSearch("");
        setShowSuggest(false);
    };

    /* ================= CLICK OUTSIDE ================= */
    useEffect(() => {
        const close = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggest(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <header className={style.headerContainer}>
            <div className={style.mainContainer}>
                {/* LOGO */}
                <div
                    className={style.brandLogo}
                    onClick={() => navigate("/app")}
                >
                    <span className={style.brandMain}>Moji</span>
                    <span className={style.brandAs}>ja </span>
                    <span className={style.brandDot}>E-Commerce</span>
                </div>

                {/* SEARCH */}
                <div className={style.searchContainer} ref={searchRef}>
                    <input
                        className={style.searchBar}
                        placeholder="Search products, brands..."
                        value={search}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                    <div
                        className={style.searchBtn}
                        onClick={() => !loading && handleSearch()}
                    >
                        {loading ? (
                            <span className={style.loader}></span>
                        ) : (
                            <img src={assets.search} alt="search" />
                        )}
                    </div>

                    {showSuggest && (
                        <div className={style.suggestionBox}>
                            {loading && (
                                <div className={style.loadingSuggest}>Searching...</div>
                            )}

                            {!loading &&
                                suggestions.slice(0, 6).map((p, idx) => (
                                    <div
                                        key={`${p.product_source}-${p.product_id}-${idx}`}
                                        className={style.suggestionItem}
                                        onClick={() => handleSearch(p.product_name)}
                                    >
                                        <strong>{p.product_name}</strong>

                                        <small>
                                            {p.brand || "Brand"}
                                            {p.category_name ? ` · ${p.category_name}` : ""}
                                            {" · "}
                                            {p.product_source === "supplier" ? "Supplier" : "Seller"}
                                        </small>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <div className={style.UserContainer}>
                    {/* CART */}
                    <div
                        className={style.cartWrapper}
                        onClick={() => navigate("/app/cart")}
                    >
                        <div className={style.cartIcon}>
                            <GrCart />
                            {cartCount > 0 && (
                                <span className={style.cartBadge}>{cartCount}</span>
                            )}
                        </div>
                    </div>

                    {/* USER */}
                    <div className={style.iconNamesLoginWrapper}>
                        <div
                            className={style.UserHover}
                            onClick={() => setOpen((p) => !p)}
                        >
                            <div className={style.avatarFallback}>
                                {getInitials(user.username)}
                            </div>
                            <IoIosArrowDown />
                        </div>


                        {isOpen && (
                            <div className={style.dropdown}>
                                <Link
                                    to="/app/myprofile"
                                    className={style.dropdownItem}
                                    onClick={() => setOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/app/orders"
                                    className={style.dropdownItem}
                                    onClick={() => setOpen(false)}
                                >
                                    Orders
                                </Link>
                                <div
                                    className={`${style.dropdownItem} ${style.logoutItem}`}
                                    // onClick={() => {
                                    //     setOpen(false);
                                    //     localStorage.clear();
                                    //     navigate("/");
                                    // }}

                                    onClick={async () => {
    setOpen(false);

    try {
        await api.get("/auth/logout"); // backend cookie clear
    } catch (err) {
        console.log(err);
    }

    // 🔥 remove login flags
    localStorage.removeItem("user");
    localStorage.removeItem("buyerLoggedIn");

    navigate("/");
}}


                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
