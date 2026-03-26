import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./NavCategory.module.css";

const NavbarCategories = () => {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);   // L1
  const [activeL2, setActiveL2] = useState(null);     // L2
  const closeTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/publices/categories/tree")
      .then((res) => setCategories(res.data.categories || []))
      .catch((err) => console.log("CATEGORY API ERROR:", err));
  }, []);

  const openMenu = (id) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveCat(id);

    const l1 = categories.find((c) => c.id === id);
    if (l1?.children?.length) {
      setActiveL2(l1.children[0].id);
    } else {
      setActiveL2(null);
    }
  };

  const closeMenu = () => {
    closeTimer.current = setTimeout(() => {
      setActiveCat(null);
      setActiveL2(null);
    }, 200);
  };

  // ✅ NEW: helper to instantly close dropdown on click
  const closeDropdownInstant = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current); // ✅ NEW
    setActiveCat(null); // ✅ NEW
    setActiveL2(null);  // ✅ NEW
  };

  const activeL1Obj = categories.find((c) => c.id === activeCat);
  const activeL2Obj = activeL1Obj?.children?.find((c) => c.id === activeL2);

  return (
    <div className={styles.navbarWrapper}>
      <button className={styles.allBtn} onClick={() => navigate("/app/categories")}>
        ☰ All Categories
      </button>

      <div className={styles.navbar}>
        {categories.map((l1) => (
          <div
            key={l1.id}
            className={styles.navItem}
            onMouseEnter={() => openMenu(l1.id)}
            onMouseLeave={closeMenu}
          >
            {/* LEVEL 1 */}
            <div className={styles.l1} onClick={() => navigate(`/app/category/${l1.id}`)}>
              <span>{l1.category_name}</span>
            </div>

            {/* DROPDOWN */}
            {activeCat === l1.id && l1.children?.length > 0 && (
              <div
                className={styles.dropdown}
                onMouseEnter={() => openMenu(l1.id)}
                onMouseLeave={closeMenu}
              >
                {/* LEFT SIDE = L2 */}
                <div className={styles.dropdownLeft}>
                  {l1.children.map((l2) => (
                    <div
                      key={l2.id}
                      className={`${styles.l2Item} ${
                        activeL2 === l2.id ? styles.activeL2 : ""
                      }`}
                      onMouseEnter={() => setActiveL2(l2.id)}
                      onClick={() => {
                        closeDropdownInstant(); // ✅ NEW: close dropdown immediately
                        navigate(`/app/category/${l2.id}`);
                      }}
                    >
                      {l2.category_name}
                    </div>
                  ))}
                </div>

                {/* RIGHT SIDE = L3 */}
                <div className={styles.dropdownRight}>
                  {activeL2Obj?.children?.length ? (
                    <>
                      <h4
                        className={styles.l3Title}
                        onClick={() => {
                          closeDropdownInstant(); // ✅ NEW
                          navigate(`/app/category/${activeL2Obj.id}`);
                        }}
                      >
                        {activeL2Obj.category_name}
                      </h4>

                      {activeL2Obj.children.map((l3) => (
                        <p
                          key={l3.id}
                          className={styles.l3}
                          onClick={() => {
                            closeDropdownInstant(); // ✅ NEW: L3 click pe dropdown hide
                            navigate(`/app/category/${l3.id}`); // products page will fetch there
                          }}
                        >
                          {l3.category_name}
                        </p>
                      ))}
                    </>
                  ) : (
                    <p className={styles.noItems}>No subcategories</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavbarCategories;
