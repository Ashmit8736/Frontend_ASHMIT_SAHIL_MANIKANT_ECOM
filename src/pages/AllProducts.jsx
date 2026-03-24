

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../store/APi/axiosInstance";
import styles from "../PagesStyles/AllProduct.module.css";
import placeholder from "../assets/no-image.png";

const LIMIT = 10;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  const isFetchingRef = useRef(false);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // 🔥 URL se type lo — "seller" | "supplier" | null (dono)
  const typeFilter = searchParams.get("type"); // "seller" | "supplier" | null

  const { id } = useParams();
  const navigate = useNavigate();

  const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  const mergeUniqueProducts = (prev, next) => {
    const map = new Map();
    [...prev, ...next].forEach((p) => {
      map.set(`${p.product_source}-${p.product_id}`, p);
    });
    return Array.from(map.values());
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async (currentPage, currentSearch, currentId, currentType) => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      // alert(id);

      /* 🔍 SEARCH MODE */
      if (currentSearch) {
        const res = await api.get("/public/buyer/search", {
          params: { query: currentSearch, page: currentPage, limit: LIMIT },
        });

        let normalized = (res.data.products || []).map((p) => ({
          ...p,
          // search response me product_source aata hai
          product_source: p.product_source,
          images: normalizeImages(p.images),
        }));

        // 🔥 TYPE FILTER — seller ya supplier ke basis pe filter karo
        if (currentType === "seller") {
          normalized = normalized.filter((p) => p.product_source === "seller");
        } else if (currentType === "supplier") {
          normalized = normalized.filter((p) => p.product_source === "supplier");
        }

        if (currentPage === 1) {
          setProducts(normalized);
        } else {
          setProducts((prev) => mergeUniqueProducts(prev, normalized));
        }

        setHasMore(normalized.length >= LIMIT);
        return;
      }

      /* 📦 ALL PRODUCTS MODE */
      if (!currentId) {

        // 🔥 TYPE FILTER — sirf seller
        if (currentType === "seller") {
          const sellerRes = await api.get("/publics/products", {
            params: { page: currentPage, limit: LIMIT },
          });

          const seller = (sellerRes.data.products || []).map((p) => ({
            ...p,
            product_source: "seller",
            images: normalizeImages(p.images),
          }));

          if (currentPage === 1) {
            setProducts(seller);
          } else {
            setProducts((prev) => mergeUniqueProducts(prev, seller));
          }

          setHasMore(seller.length >= LIMIT);
          return;
        }

        // 🔥 TYPE FILTER — sirf supplier
        if (currentType === "supplier") {
          const supplierRes = await api.get("/public-supplier/products", {
            params: { page: currentPage, limit: LIMIT },
          });

          const supplier = (supplierRes.data.products || []).map((p) => ({
            ...p,
            product_source: "supplier",
            images: normalizeImages(p.images),
          }));

          if (currentPage === 1) {
            setProducts(supplier);
          } else {
            setProducts((prev) => mergeUniqueProducts(prev, supplier));
          }

          setHasMore(supplier.length >= LIMIT);
          return;
        }

        // 🔥 NO FILTER — dono seller + supplier
        const [sellerRes, supplierRes] = await Promise.all([
          api.get("/publics/products", { params: { page: currentPage, limit: LIMIT } }),
          api.get("/public-supplier/products", { params: { page: currentPage, limit: LIMIT } }),
        ]);

        const seller = (sellerRes.data.products || []).map((p) => ({
          ...p,
          product_source: "seller",
          images: normalizeImages(p.images),
        }));

        const supplier = (supplierRes.data.products || []).map((p) => ({
          ...p,
          product_source: "supplier",
          images: normalizeImages(p.images),
        }));

        const combined = [...seller, ...supplier];

        if (currentPage === 1) {
          setProducts(combined);
        } else {
          setProducts((prev) => mergeUniqueProducts(prev, combined));
        }

        setHasMore(!(seller.length < LIMIT && supplier.length < LIMIT));
        return;
      }

      /* 📂 CATEGORY MODE */
      const res = await api.get(`/publics/products/by-category/${currentId}`, {
        params: { page: currentPage, limit: LIMIT },
      });

      let categoryProducts = (res.data.products || []).map((p) => ({
        ...p,
        // category response me product_source aata hai
        product_source: p.product_source,
        images: normalizeImages(p.images),
      }));

      // 🔥 TYPE FILTER category me bhi
      if (currentType === "seller") {
        categoryProducts = categoryProducts.filter((p) => p.product_source === "seller");
      } else if (currentType === "supplier") {
        categoryProducts = categoryProducts.filter((p) => p.product_source === "supplier");
      }

      if (currentPage === 1) {
        setProducts(categoryProducts);
      } else {
        setProducts((prev) => mergeUniqueProducts(prev, categoryProducts));
      }

      setHasMore(categoryProducts.length >= LIMIT);

    } catch (err) {
      console.error("AllProducts fetch error:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  /* ================= RESET + FETCH jab search/id/type badle ================= */
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = false;

    fetchProducts(1, searchQuery, id, typeFilter);
  }, [searchQuery, id, typeFilter]); // 🔥 typeFilter bhi dependency me

  /* ================= FETCH jab page badle (scroll) ================= */
  useEffect(() => {
    if (page === 1) return;
    fetchProducts(page, searchQuery, id, typeFilter);
  }, [page]);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore]);

  const openProduct = (product) => {
    navigate(`/app/product/${product.product_id}?type=${product.product_source}`);
  };

  /* ================= UI ================= */
  return (
    <div className={styles.mainWrapper}>

      {/* 🔥 FILTER TABS — URL change karenge */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterBtn} ${!typeFilter ? styles.activeFilter : ""}`}
          onClick={() => navigate(`/app/allproducts${searchQuery ? `?search=${searchQuery}` : ""}`)}
        >
          All
        </button>
        <button
          className={`${styles.filterBtn} ${typeFilter === "seller" ? styles.activeFilter : ""}`}
          onClick={() => navigate(`/app/allproducts?type=seller${searchQuery ? `&search=${searchQuery}` : ""}`)}
        >
          Seller
        </button>
        <button
          className={`${styles.filterBtn} ${typeFilter === "supplier" ? styles.activeFilter : ""}`}
          onClick={() => navigate(`/app/allproducts?type=supplier${searchQuery ? `&search=${searchQuery}` : ""}`)}
        >
          Supplier
        </button>
      </div>

      <div className={styles.grid}>

        {/* 🔥 LOADING SKELETON */}
        {loading && products.length === 0 &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonPrice} />
            </div>
          ))}

        {/* ❌ NO PRODUCTS */}
        {!loading && products.length === 0 && (
          <p style={{ padding: 20 }}>
            {searchQuery
              ? `"${searchQuery}" ke liye koi product nahi mila`
              : "No products found"}
          </p>
        )}

        {/* ✅ PRODUCTS */}
        {products.map((p) => {
          // product_source field use karo — no fallback
          const source = p.product_source;

          // 🔥 STOCK LOGIC — sirf seller pe check
          const stock = p.remaining_stock;
          const isOutOfStock = source === "seller" && stock !== null && Number(stock) === 0;
          const isComingSoon = source === "seller" && (stock === null || stock === undefined);
          const isUnavailable = isOutOfStock || isComingSoon;

          return (
            <div
              key={`${source}-${p.product_id}`}
              className={`${styles.card} ${isUnavailable ? styles.cardDisabled : ""}`}
              onClick={() => { if (!isUnavailable) openProduct(p); }}
              style={{ cursor: isUnavailable ? "not-allowed" : "pointer", position: "relative" }}
            >
              {/* 🔴 OUT OF STOCK BADGE */}
              {isOutOfStock && (
                <div className={styles.stockBadge} style={{ background: "#e53935" }}>
                  Out of Stock
                </div>
              )}

              {/* 🟠 COMING SOON BADGE */}
              {isComingSoon && (
                <div className={styles.stockBadge} style={{ background: "#f57c00" }}>
                  Coming Soon
                </div>
              )}

              <img
                src={p.images?.[0] || p.thumbnail || placeholder}
                className={`${styles.image} ${isUnavailable ? styles.imageBlurred : ""}`}
                alt={p.product_name}
              />

              <div className={styles.title}>{p.product_name}</div>

              <div className={styles.brand}>
                {p.brand || "Brand"}
                {/* 🔥 product_source se tag dikhao */}
                <span className={source === "supplier" ? styles.supplierTag : styles.sellerTag}>
                  {source === "supplier" ? "Supplier" : "Seller"}
                </span>
              </div>

              <div className={styles.price}>
                ₹ {p.product_price || p.price}
              </div>

              {source === "seller" && (
                <div className={styles.rating}>
                  Rating: {p.rating_avg || p.product_rating || p.rating || p.avg_rating || 0}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔄 LOADER */}
      {hasMore && (
        <div ref={loaderRef} className={styles.loaderWrapper}>
          {loading && products.length > 0 && <div className={styles.loader} />}
        </div>
      )}

      {/* ✅ END */}
      {!hasMore && products.length > 0 && (
        <p style={{ textAlign: "center", padding: 20 }}>
          No more products 🚫
        </p>
      )}
    </div>
  );
};

export default AllProducts;