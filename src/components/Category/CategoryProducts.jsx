//Ashmit Singh
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../store/APi/axiosInstance";
import styles from "./CategoryProducts.module.css";
import placeholder from "../../assets/no-image.png";

const MAX_PRICE = 100000;

const CategoryProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const JEWELLERY_CATEGORY_IDS = ['99'];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [source, setSource] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedMetal, setSelectedMetal] = useState("all");

  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [tempPrice, setTempPrice] = useState([0, MAX_PRICE]);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");

  const [minRating, setMinRating] = useState(0);

  const [openSections, setOpenSections] = useState({
    brand: true,
    discount: false,
    price: true,
    ratings: true,
    metal: true,
  });

  const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // const getRating = (p) => {
  //   return Number(p.product_rating || p.rating || p.avg_rating || 0);
  // };

  // AB — rating_avg sabse pehle add karo
const getRating = (p) => {
  return Number(p.rating_avg || p.product_rating || p.rating || p.avg_rating || 0);
};

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setSource("all");
    setSort("newest");
    setPriceRange([0, MAX_PRICE]);
    setTempPrice([0, MAX_PRICE]);
    setSelectedBrands([]);
    setBrandSearch("");
    setMinRating(0);
    setSelectedMetal("all");
  };

  /* ================= FETCH CATEGORY PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/public/buyer/products/by-category/${id}?sort=${sort}`
        );
    console.log("API RESPONSE:", res.data);
    console.log("CATEGORY ID:", id);
        let list = (res.data.products || []).map((p) => ({
          ...p,
          // 🔥 CHANGE 1 — p.product_source directly use karo, koi fallback nahi
          // PEHLE: source: p.product_source (same tha lekin navigate me nahi jaata tha)
          // AB: same, par navigate me bhi sahi bhejenge
          product_source: p.product_source,
          images: normalizeImages(p.images),
        }));

        // SOURCE FILTER
        if (source !== "all") {
          list = list.filter((p) => p.product_source === source);
        }

        // PRICE FILTER
        list = list.filter(
          (p) =>
            Number(p.product_price) >= priceRange[0] &&
            Number(p.product_price) <= priceRange[1]
        );

        // METAL FILTER
        if (selectedMetal !== "all") {
          list = list.filter(
            (p) => (p.metal_type || "").toLowerCase().trim() === selectedMetal
          );
        }

        // BRAND FILTER
        if (selectedBrands.length > 0) {
          list = list.filter((p) => {
            const b = p.brand_name || p.brand || "Other";
            return selectedBrands.includes(b);
          });
        }

        // RATING FILTER
        if (minRating > 0) {
          list = list.filter((p) => getRating(p) >= minRating);
        }

        // SORT fallback
        if (sort === "price_asc") list.sort((a, b) => a.product_price - b.product_price);
        if (sort === "price_desc") list.sort((a, b) => b.product_price - a.product_price);

        setProducts(list);
      } catch (err) {
        console.error("CategoryProducts error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, source, sort, priceRange, selectedBrands, minRating, selectedMetal]);

  const brandList = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const b = p.brand_name || p.brand || "Other";
      set.add(b);
    });
    return Array.from(set).sort();
  }, [products]);

  useEffect(() => {
  console.log("METAL CHECK:", products.slice(0, 3).map(p => ({
    name: p.product_name,
    metal: p.metal_type,
    source: p.product_source
  })));
}, [products]);

  const filteredBrandList = useMemo(() => {
    if (!brandSearch.trim()) return brandList;
    return brandList.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandList, brandSearch]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) return prev.filter((b) => b !== brand);
      return [...prev, brand];
    });
  };

  const priceSteps = [0, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

  const brandSummary =
    selectedBrands.length === 0 ? "Brand" : `${selectedBrands.length} Selected`;

  const priceSummary =
    priceRange[0] === 0 && priceRange[1] === MAX_PRICE
      ? "Price filter"
      : `₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`;

  const ratingSummary = minRating === 0 ? "Rating" : `${minRating}★ & above`;
  const discountSummary = "Discount Filter";

  if (loading) return <p className={styles.loading}>Loading products...</p>;

  return (
    <section className={styles.productsPage}>
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarScroll}>
          <div className={styles.sidebarHeader}>
            <h3>Filters</h3>
            <button className={styles.clearBtn} onClick={clearAllFilters}>
              Clear All
            </button>
          </div>

          {/* SOURCE + SORT */}
          <div className={styles.quickFilters}>
            <div className={styles.fieldLabel}>Source</div>
            <select
              className={styles.select}
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="all">All</option>
              <option value="seller">Seller</option>
              <option value="supplier">Supplier</option>
            </select>

            <div className={styles.fieldLabel}>Price Sort</div>
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>

{JEWELLERY_CATEGORY_IDS.includes(id) && (
              <div>
                <div className={styles.fieldLabel}>Metal</div>
                <select
                  className={styles.select}
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="diamond">Diamond</option>
                </select>
              </div>
            )}
          </div>

          {/* BRAND */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("brand")}
            >
              <div className={styles.sectionLeft}>
                <div className={styles.sectionTitle}>BRAND</div>
                <div className={styles.sectionSub}>{brandSummary}</div>
              </div>
              <div className={styles.sectionRight}>
                <span className={styles.chev}>{openSections.brand ? "˄" : "˅"}</span>
              </div>
            </button>

            {openSections.brand && (
              <div className={styles.sectionBody}>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search Brand"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                />
                <div className={styles.brandList}>
                  {filteredBrandList.length === 0 ? (
                    <p className={styles.muted}>No brands found</p>
                  ) : (
                    filteredBrandList.map((b) => (
                      <label key={b} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(b)}
                          onChange={() => toggleBrand(b)}
                        />
                        <span>{b}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DISCOUNT */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("discount")}
            >
              <div className={styles.sectionLeft}>
                <div className={styles.sectionTitle}>DISCOUNT</div>
                <div className={styles.sectionSub}>{discountSummary}</div>
              </div>
              <div className={styles.sectionRight}>
                <span className={styles.chev}>{openSections.discount ? "˄" : "˅"}</span>
              </div>
            </button>

            {openSections.discount && (
              <div className={styles.sectionBody}>
                <p className={styles.muted}>
                  Discount filter ka backend available nahi hai abhi. UI ready hai.
                </p>
              </div>
            )}
          </div>

          {/* PRICE */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("price")}
            >
              <div className={styles.sectionLeft}>
                <div className={styles.sectionTitle}>PRICE</div>
                <div className={styles.sectionSub}>{priceSummary}</div>
              </div>
              <div className={styles.sectionRight}>
                <span className={styles.chev}>{openSections.price ? "˄" : "˅"}</span>
              </div>
            </button>

            {openSections.price && (
              <div className={styles.sectionBody}>
                <div className={styles.rangeBar}>
                  <input
                    className={styles.range}
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    value={tempPrice[0]}
                    onChange={(e) => setTempPrice([+e.target.value, tempPrice[1]])}
                  />
                  <input
                    className={styles.range}
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    value={tempPrice[1]}
                    onChange={(e) => setTempPrice([tempPrice[0], +e.target.value])}
                  />
                </div>

                <div className={styles.priceDropdowns}>
                  <select
                    className={styles.select}
                    value={tempPrice[0]}
                    onChange={(e) => setTempPrice([+e.target.value, tempPrice[1]])}
                  >
                    {priceSteps.map((v) => (
                      <option key={v} value={v}>{v === 0 ? "Min" : `₹${v}`}</option>
                    ))}
                  </select>

                  <span className={styles.toText}>to</span>

                  <select
                    className={styles.select}
                    value={tempPrice[1]}
                    onChange={(e) => setTempPrice([tempPrice[0], +e.target.value])}
                  >
                    {priceSteps.map((v) => (
                      <option key={v} value={v}>{v === MAX_PRICE ? `₹${v}+` : `₹${v}`}</option>
                    ))}
                  </select>
                </div>

                <button
                  className={styles.applyBtn}
                  onClick={() => setPriceRange(tempPrice)}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* RATINGS */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection("ratings")}
            >
              <div className={styles.sectionLeft}>
                <div className={styles.sectionTitle}>CUSTOMER RATINGS</div>
                <div className={styles.sectionSub}>{ratingSummary}</div>
              </div>
              <div className={styles.sectionRight}>
                <span className={styles.chev}>{openSections.ratings ? "˄" : "˅"}</span>
              </div>
            </button>

            {openSections.ratings && (
              <div className={styles.sectionBody}>
                {[4, 3, 2, 1].map((r) => (
                  <label key={r} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={minRating === r}
                      onChange={() => setMinRating((prev) => (prev === r ? 0 : r))}
                    />
                    <span>{r}★ & above</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= RIGHT PRODUCTS ================= */}
      <div className={styles.main}>
        <div className={styles.productsScroll}>
          <div className={styles.topBar}>
            <h2 className={styles.pageTitle}>Products</h2>
            <p className={styles.count}>{products.length} items</p>
          </div>

          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => {


const stock = p.remaining_stock;

const isOutOfStock = Number(stock) === 0;
const isComingSoon = stock == null;

const isUnavailable = isOutOfStock || isComingSoon;

                return (
                  <div
                    key={`${p.product_source}-${p.product_id}`}
                    className={`${styles.card} ${isUnavailable ? styles.cardDisabled : ""}`}
                    style={{
                      cursor: isUnavailable ? "not-allowed" : "pointer",
                      position: "relative",
                    }}
                    onClick={() => {
                      if (isUnavailable) return;
                    
                      navigate(`/app/product/${p.product_id}?type=${p.product_source}`);
                    }}
                  >
                    {/* 🔴 OUT OF STOCK BADGE */}
                    {isOutOfStock && (
                      <div
                        style={{
                          position: "absolute", top: 10, left: 10,
                          background: "#e53935", color: "white",
                          fontSize: 11, fontWeight: 700,
                          padding: "4px 10px", borderRadius: 20,
                          zIndex: 10, textTransform: "uppercase",
                        }}
                      >
                        Out of Stock
                      </div>
                    )}

                    {/* 🟠 COMING SOON BADGE */}
                    {isComingSoon && (
                      <div
                        style={{
                          position: "absolute", top: 10, left: 10,
                          background: "#f57c00", color: "white",
                          fontSize: 11, fontWeight: 700,
                          padding: "4px 10px", borderRadius: 20,
                          zIndex: 10, textTransform: "uppercase",
                        }}
                      >
                        Coming Soon
                      </div>
                    )}

                    <div className={styles.imageWrap}>
                      <img
                        src={p.images?.[0] || placeholder}
                        alt={p.product_name}
                        style={{ opacity: isUnavailable ? 0.45 : 1, filter: isUnavailable ? "grayscale(60%)" : "none" }}
                      />
                    </div>

                    <div className={styles.cardBody}>
                      <h4 className={styles.productName}>{p.product_name}</h4>
                      <p className={styles.price}>₹ {p.product_price}</p>

                      <div className={styles.metaRow}>
                        <span
                          className={
                            p.product_source === "supplier"
                              ? styles.supplierTag
                              : styles.sellerTag
                          }
                        >
                          {p.product_source === "supplier" ? "Supplier" : "Seller"}
                        </span>

                        <span className={styles.ratingPill}>
                          {getRating(p).toFixed(1)} ★
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts;