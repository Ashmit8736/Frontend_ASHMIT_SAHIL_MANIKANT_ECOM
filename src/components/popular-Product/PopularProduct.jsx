// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../store/APi/axiosInstance";
// import styles from "./PopularProduct.module.css";
// import placeholder from "../../assets/no-image.png";

// const PopularProduct = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/public/popular-products");
//       setProducts(res.data.products || []);

//       const seller = (sellerRes.data.products || []).map((p) => ({
//         ...p,
//         source: "seller",
//         popularityScore: p.order_count || p.rating_avg || 0,
//       }));

//       const supplier = (supplierRes.data.products || []).map((p) => ({
//         ...p,
//         source: "supplier",
//         popularityScore: p.total_orders || p.total_stock || 0,
//       }));

//       // 🔥 MIX + SORT BY POPULARITY
//       const mixed = [...seller, ...supplier]
//         .sort((a, b) => b.popularityScore - a.popularityScore)
//         .slice(0, 6);

//       setProducts(mixed);
//     } catch (error) {
//       console.error("Popular products fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <section className={styles.mainpopular}>
//       <div className={styles.headingPopular}>
//         <h2>Popular Products</h2>
//         <button onClick={() => navigate("/app/allproducts")}>
//           View All Products
//         </button>
//       </div>

//       <p className={styles.subtitle}>
//         Top trending products from verified sellers & suppliers
//       </p>

//       <div className={styles.productGrid}>
//         {loading
//           ? [...Array(6)].map((_, i) => (
//             <div key={i} className={styles.skeletonCard}>
//               <div className={styles.skeletonImg}></div>
//               <div className={styles.skeletonText}></div>
//               <div className={styles.skeletonTextSmall}></div>
//             </div>
//           ))
//           : products.map((item) => (
//             <div
//               key={`${item.source}-${item.product_id}`}
//               className={styles.card}
//               onClick={() =>
//                 navigate(`/app/product/${item.product_id}`, {
//                   state: { pdt: item },
//                 })
//               }
//             >
//               {/* 🔥 SOURCE BADGE */}
//               <span
//                 className={
//                   item.source === "supplier"
//                     ? styles.supplierTag
//                     : styles.sellerTag
//                 }
//               >
//                 {item.source === "supplier" ? "Supplier" : "Seller"}
//               </span>

//               {/* 🔥 POPULAR BADGE */}
//               <span className={styles.popularBadge}>Popular</span>

//               <div className={styles.imgCont}>
//                 <img
//                   src={item.image || placeholder}
//                   alt={item.product_name}
//                 />
//               </div>

//               <h4>{item.product_name}</h4>

//               <p className={styles.price}>₹ {item.product_price}</p>

//               <small className={styles.meta}>
//                 {item.source === "supplier"
//                   ? item.supplier_company || "Verified Supplier"
//                   : item.category_name || "Verified Seller"}
//               </small>
//             </div>
//           ))}
//       </div>
//     </section>
//   );
// };

// export default PopularProduct;


import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../store/APi/axiosInstance";
import styles from "./PopularProduct.module.css";
import placeholder from "../../assets/no-image.png";

const PopularProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery =
    new URLSearchParams(location.search).get("search") || "";

  /* 🔧 IMAGE NORMALIZER */
  const normalizeImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  };

  /* 🔥 REMOVE DUPLICATES (seller + supplier safe) */
  const uniqueById = (list) => {
    const map = new Map();
    list.forEach((p) => {
      map.set(`${p.product_source}-${p.product_id}`, p);
    });
    return Array.from(map.values());
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let res;

      // 🔍 SEARCH MODE
      if (searchQuery) {
        res = await api.get(
          `/public/buyer/search?query=${encodeURIComponent(searchQuery)}`
        );
      }
      // 🔥 POPULAR MODE
      else {
        res = await api.get("/public/popular-products");
      }

      const normalized = (res.data.products || []).map((p) => ({
        ...p,

        // 🔥 FORCE SOURCE (THIS FIXES YOUR TAG ISSUE)
        product_source:
          p.product_source ||
          p.owner_type ||
          p.source ||
          "seller",

        images: normalizeImages(p.images),
      }));

      setProducts(uniqueById(normalized).slice(0, 6));
    } catch (error) {
      console.error("Popular products fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  return (
    <section className={styles.mainpopular}>
      <div className={styles.headingPopular}>
        <h2>
          {searchQuery ? `Results for "${searchQuery}"` : "Popular Products"}
        </h2>

        <button onClick={() => navigate("/app/allproducts")}>
          View All Products
        </button>
      </div>

      <p className={styles.subtitle}>
        Top trending products from verified sellers & suppliers
      </p>

      <div className={styles.productGrid}>
        {loading
          ? [...Array(6)].map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))
          : products.map((item) => (
            <div
              key={`${item.product_source}-${item.product_id}`}
              className={styles.card}
              onClick={() =>
                navigate(
                  `/app/product/${item.product_id}?type=${item.product_source}`
                )
              }
            >
              {/* ✅ SOURCE BADGE */}
              <span
                className={
                  item.product_source === "supplier"
                    ? styles.supplierTag
                    : styles.sellerTag
                }
              >
                {item.product_source === "supplier"
                  ? "Supplier"
                  : "Seller"}
              </span>

              {!searchQuery && (
                <span className={styles.popularBadge}>Popular</span>
              )}

              <div className={styles.imgCont}>
                <img
                  src={item.images[0] || placeholder}
                  alt={item.product_name}
                />
              </div>

              <h4>{item.product_name}</h4>
              <p className={styles.price}>₹ {item.product_price}</p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default PopularProduct;
