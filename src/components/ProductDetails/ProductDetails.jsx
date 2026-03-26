
// import React, { useState, useMemo, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ImageZoom from "../ImageZoom/ImageZoom";
// import styles from "./ProductDetails.module.css";
// import toast, { Toaster } from "react-hot-toast";
// import placeholder from "../../assets/no-image.png";
// import axios from "axios";

// import { useDispatch } from "react-redux";
// import { addOrUpdateItem } from "../../store/slices/cartSlice";
// import StarRating from "../Rating/StarRating";





// const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [rawProduct, setRawProduct] = useState(null);
//   // const [loading, setLoading] = useState(true); product.ownerType === "supplier"
//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [avgRating, setAvgRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);
//   const [myRating, setMyRating] = useState(0);
//   const [review, setReview] = useState("");

//   const [qty, setQty] = useState(1);
//   const [isInCart, setIsInCart] = useState(false);
//   const dispatch = useDispatch();
//   const [currIndex, setCurrIndex] = useState(0);
//   const [imageLoaded, setImageLoaded] = useState(false);


//   const [qaData, setQaData] = useState([]);
//   const [newQuestion, setNewQuestion] = useState("");

//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [relatedLoading, setRelatedLoading] = useState(false);

//   const [recentProducts, setRecentProducts] = useState([]);






//   /* ================= FETCH PRODUCT ================= */

//   const fetchRatings = async (ownerType) => {
//     if (!id || !ownerType) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/product/ratings/${id}/${ownerType}`,
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         setAvgRating(res.data.avg_rating || 0);
//         setRatingCount(res.data.rating_count || 0);

//         if (res.data.my_rating) {
//           setMyRating(res.data.my_rating.rating);
//           setReview(res.data.my_rating.review || "");
//         }
//       }
//     } catch (err) {
//       console.log("Rating fetch error");
//     }
//   };
//   const product = useMemo(() => {
//     if (!rawProduct) return null;

//     let images = [];

//     // JSON.stringify(rawProduct, null, 2);
//     if (Array.isArray(rawProduct.images)) {
//       images = rawProduct.images;
//     } else if (typeof rawProduct.images === "string") {
//       try {
//         const parsed = JSON.parse(rawProduct.images);
//         if (Array.isArray(parsed)) images = parsed;
//       } catch {
//         images = [];
//       }
//     }

//     if (!images.length) images = [placeholder];

//     return {
//       ...rawProduct,
//       image: images,
//       title: rawProduct.product_name || "Product",
//       price: rawProduct.product_price || 0,
//       brand: rawProduct.brand || "—",
//       rating: rawProduct.rating_avg || "—",
//       ownerType: rawProduct.owner_type,// 🔥 seller | supplier
//       moq: rawProduct.wholesale_moq || 1,
//     };
//   }, [rawProduct]);

//   const isSupplier = product?.ownerType === "supplier";

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {



//         setLoading(true);

//         alert(id);
//         console.log("dgas")

//         const res = await fetch(
//           `http://localhost:3000/api/publics/product/${id}`
//         );

//         const json = await res.json();

//         if (!json.success || !json.product) {
//           throw new Error("Product not found");
//         }

//         setRawProduct(json.product);
//         setError("");
//       } catch (err) {
//         console.error("FETCH PRODUCT ERROR:", err);
//         setError("Product not found");
//       } finally {
//         setLoading(false);
//       }
//     };


//     if (id) fetchProduct();
//   }, [id]);


//   /* ================= RECENTLY VIEWED SAVE ================= */
//   useEffect(() => {
//     if (!product?.product_id) return;

//     const key = "recent_products";

//     let items = JSON.parse(localStorage.getItem(key)) || [];

//     items = items.filter(id => id !== product.product_id);
//     items.unshift(product.product_id);
//     items = items.slice(0, 10);

//     localStorage.setItem(key, JSON.stringify(items));
//   }, [product?.product_id]);



//   useEffect(() => {
//     if (rawProduct?.owner_type) {
//       fetchRatings(rawProduct.owner_type);
//     }
//   }, [id, rawProduct?.owner_type]);

//   useEffect(() => {
//     if (id) {
//       fetchQA();
//       fetchRelatedProducts();
//     }
//   }, [id]);



//   useEffect(() => {
//     const ids = JSON.parse(localStorage.getItem("recent_products")) || [];

//     if (!ids.length) return;

//     axios
//       .get(`http://localhost:3000/api/products/recent?ids=${ids.join(",")}`)
//       .then(res => setRecentProducts(res.data))
//       .catch(() => { });
//   }, [product?.product_id]);





//   useEffect(() => {
//     if (!product) return;

//     if (product.ownerType === "supplier") {
//       setQty(product.moq); // MOQ default
//     } else {
//       setQty(1);
//     }
//   }, [product?.ownerType, product?.moq]);
//   useEffect(() => {
//     setImageLoaded(false);
//   }, [currIndex]);
//   useEffect(() => {
//     const checkCart = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/cart", {
//           withCredentials: true,
//         });

//         const items = Array.isArray(res.data) ? res.data : [];

//         const exists = items.some(
//           (item) =>
//             item.product_id === product.product_id &&
//             item.owner_type === product.ownerType
//         );

//         setIsInCart(exists);
//       } catch (err) {
//         console.log("Cart not available yet");
//       }
//     };

//     if (product?.product_id && product?.ownerType) {
//       checkCart();
//     }
//   }, [product?.product_id, product?.ownerType]);

//   const submitRating = async () => {
//     if (!product) return;
//     if (!myRating) return toast.error("Select rating first");

//     try {
//       await axios.post(
//         "http://localhost:3000/api/product/rating",
//         {
//           product_id: product.product_id,
//           rating: myRating,
//           review,
//           owner_type: product.ownerType,
//         },
//         { withCredentials: true }
//       );

//       toast.success("Rating submitted");

//       // ✅ 1. Refresh ratings
//       await fetchRatings(product.ownerType);

//       // ✅ 2. Refresh product (important)
//       const res = await fetch(
//         `http://localhost:3000/api/publics/product/${id}`
//       );
//       const json = await res.json();
//       if (json.success) {
//         setRawProduct(json.product);
//       }

//     } catch {
//       toast.error("Login required to rate");
//     }
//   };


//   const handleAskQuestion = async () => {
//     if (!newQuestion.trim()) return;

//     try {
//       await axios.post(
//         "http://localhost:3000/api/product/qa/ask",
//         {
//           product_id: id,
//           question: newQuestion,
//         },
//         { withCredentials: true }
//       );

//       setNewQuestion("");
//       fetchQA();
//     } catch {
//       toast.error("Login required");
//     }
//   };

//   const fetchRelatedProducts = async () => {
//     try {
//       setRelatedLoading(true);

//       const res = await axios.get(
//         `http://localhost:3000/api/public/${id}/related`
//       );

//       setRelatedProducts(res.data || []);
//     } catch (err) {
//       console.log("Related fetch error");
//     } finally {
//       setRelatedLoading(false);
//     }
//   };





//   //=========== Q & A Section Function ===========//


//   const fetchQA = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/product/qa/${id}`
//       );

//       if (res.data.success) {
//         const rows = res.data.data;

//         const grouped = [];

//         rows.forEach((row) => {
//           let existing = grouped.find(
//             (q) => q.id === row.question_id
//           );

//           if (!existing) {
//             existing = {
//               id: row.question_id,
//               question: row.question,
//               created_at: row.created_at,
//               answers: [],
//             };
//             grouped.push(existing);
//           }

//           if (row.answer_id) {
//             existing.answers.push({
//               id: row.answer_id,
//               text: row.answer,
//               by: row.answered_by,
//               isSeller: row.answered_by === "seller",
//             });
//           }
//         });

//         setQaData(grouped);
//       }
//     } catch (err) {
//       console.log("QA fetch error");
//     }
//   };



//   /* ================= NORMALIZE ================= */




//   /* ================= CART ================= */
//   const handleAddToCart = async () => {
//     try {
//       // 🔥 1. OPTIMISTIC UPDATE (Navbar turant update hoga)
//       dispatch(
//         addOrUpdateItem({
//           product_id: product.product_id,
//           quantity: qty,
//           owner_type: product.ownerType,
//           price: product.price,
//         })
//       );

//       // 🔥 2. API CALL (background me)
//       await axios.post(
//         "http://localhost:3000/api/cart/add",
//         {
//           product_id: product.product_id,
//           quantity: qty,
//         },
//         { withCredentials: true }
//       );

//       toast.success("Product added to cart");
//       setIsInCart(true);
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message || "Add to cart failed"
//       );
//     }
//   };



//   const handleBuyNow = async () => {
//     if (isSupplier) {
//       return toast.error("Supplier products are pickup only");
//     }

//     try {
//       if (!isInCart) {
//         await axios.post(
//           "http://localhost:3000/api/cart/add",
//           { product_id: product.product_id, quantity: qty },
//           { withCredentials: true }
//         );
//       }
//       navigate("/app/checkout");
//     } catch {
//       toast.error("Please login to continue");
//     }
//   };
//   /* ================= STATES ================= */
//   if (loading) {
//     return <h2 style={{ textAlign: "center" }}>Loading product...</h2>;
//   }

//   if (error || !product) {
//     return <h2 style={{ textAlign: "center" }}>Product not found!</h2>;
//   }



//   /* ================= UI ================= */
//   return (
//     <>
//       <Toaster position="top-center" />

//       <div className={styles.productContainer}>
//         {/* LEFT */}
//         <div className={styles.imageSection}>
//           <div className={styles.thumbnailList}>
//             {product.image.map((img, index) => (
//               <img
//                 key={index}
//                 src={img || placeholder}
//                 alt=""
//                 loading="lazy"
//                 decoding="async"
//                 className={`${styles.thumbnail} ${index === currIndex ? styles.activeThumb : ""
//                   }`}
//                 onClick={() => setCurrIndex(index)}
//               />
//             ))}
//           </div>

//           <div className={styles.mainImage}>
//             {!imageLoaded && <div className={styles.imageSkeleton} />}

//             <img
//               src={product.image[currIndex] || placeholder}
//               alt={product.title}
//               className={styles.mainProductImage}
//               loading="lazy"
//               decoding="async"
//               onLoad={() => setImageLoaded(true)}
//               style={{ display: imageLoaded ? "block" : "none" }}
//             />

//             {imageLoaded && (
//               <ImageZoom
//                 src={product.image[currIndex] || placeholder}
//                 containerClass={styles.zoomOverlay}
//               />
//             )}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className={styles.detailsSection}>
//           <h2 className={styles.productTitle}>{product.title}</h2>

//           <p className={styles.productBrand}>Brand: {product.brand}</p>

//           <div className={styles.ratingBox}>
//             <StarRating value={avgRating} readOnly />
//             <span className={styles.ratingText}>
//               {avgRating.toFixed(1)} / 5 ({ratingCount} ratings)
//             </span>
//           </div>

//           {product.ownerType === "supplier" && (
//             <p className={styles.moqText}>
//               Minimum Order Quantity:
//               <strong> {product.moq}</strong>
//             </p>
//           )}

//           <div className={styles.priceBox}>
//             ₹ {Number(product.price).toLocaleString("en-IN")}
//             <span className={styles.taxText}> (Incl. of all taxes)</span>
//           </div>

//           {isSupplier && (
//             <div
//               style={{
//                 marginTop: 10,
//                 padding: "10px 14px",
//                 background: "#f1f8ff",
//                 border: "1px dashed #2874f0",
//                 borderRadius: 8,
//                 color: "#0b5ed7",
//                 fontSize: 14,
//                 fontWeight: 500,
//               }}
//             >
//               🏭 <strong>Self Pickup Only</strong>
//               <br />
//               Buyer will collect goods directly from supplier warehouse.
//             </div>
//           )}

//           <div className={styles.buttonGroup}>
//             {!isInCart ? (
//               <button className={styles.addToCart} onClick={handleAddToCart}>
//                 {isSupplier ? "Add for Pickup" : "Add to Cart"}
//               </button>
//             ) : (
//               <button
//                 className={styles.goToCart}
//                 onClick={() => navigate("/app/cart")}
//               >
//                 Go to Cart
//               </button>
//             )}

//             {!isSupplier && (
//               <button className={styles.buyNow} onClick={handleBuyNow}>
//                 Buy Now
//               </button>
//             )}
//           </div>

//           {/* SELLER DETAILS */}
//           <div className={styles.sellerCard}>
//             <div className={styles.sellerHeader}>
//               <h4>
//                 Sold By (
//                 {product.ownerType === "supplier" ? "Supplier" : "Seller"})
//               </h4>

//               {product.approval_status === "approved" && (
//                 <span className={styles.verifiedBadge}>
//                   ✔ Verified {product.ownerType}
//                 </span>
//               )}
//             </div>

//             <div className={styles.sellerRow}>
//               <span className={styles.label}>
//                 {product.ownerType === "supplier"
//                   ? "Supplier Name"
//                   : "Seller Name"}
//               </span>
//               <span className={styles.value}>{product.seller_name}</span>
//             </div>

//             <div className={styles.sellerRow}>
//               <span className={styles.label}>Company</span>
//               <span className={styles.value}>{product.company_name}</span>
//             </div>

//             <div className={styles.sellerRow}>
//               <span className={styles.label}>Location</span>
//               <span className={styles.value}>
//                 {product.branch_city}, {product.branch_state}
//               </span>
//             </div>

//             {product.short_description && (
//               <div className={styles.sellerDesc}>
//                 <strong>Short Description</strong>
//                 <p>{product.short_description}</p>
//               </div>
//             )}

//             {product.long_description && (
//               <div className={styles.productDescription}>
//                 <h3>Product Description</h3>
//                 <p style={{ whiteSpace: "pre-line" }}>
//                   {product.long_description}
//                 </p>
//               </div>
//             )}

//             {/* ================= Q & A SECTION ================= */}
//             <div className={styles.qaSection}>
//               <h3 className={styles.qaTitle}>Questions & Answers</h3>

//               <div className={styles.askQuestionBox}>
//                 <input
//                   type="text"
//                   placeholder="Have a question? Ask here"
//                   value={newQuestion}
//                   onChange={(e) => setNewQuestion(e.target.value)}
//                 />
//                 <button onClick={handleAskQuestion}>Ask</button>
//               </div>

//               {qaData.length === 0 && (
//                 <p style={{ marginTop: 10 }}>No questions yet.</p>
//               )}

//               {qaData.map((qa) => (
//                 <div key={qa.id} className={styles.qaItem}>
//                   <p className={styles.questionText}>Q: {qa.question}</p>

//                   {qa.answers.map((ans) => (
//                     <div key={ans.id} className={styles.answerBox}>
//                       <div className={styles.answerHeader}>
//                         <span className={styles.answerBy}>{ans.by}</span>
//                         {ans.isSeller && (
//                           <span className={styles.sellerBadge}>Seller</span>
//                         )}
//                       </div>
//                       <p className={styles.answerText}>{ans.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>

//             {/* RATING */}
//             <div className={styles.productRatingBox}>
//               <h4 className={styles.ratingTitle}>Rate this product</h4>

//               <StarRating value={myRating} onChange={setMyRating} />

//               <p className={styles.ratingInfo}>
//                 {avgRating} ★ average from {ratingCount} ratings
//               </p>

//               <textarea
//                 className={styles.reviewInput}
//                 placeholder="Write a review (optional)"
//                 value={review}
//                 onChange={(e) => setReview(e.target.value)}
//               />

//               <button
//                 className={styles.submitRatingBtn}
//                 onClick={submitRating}
//               >
//                 {myRating ? "Update Rating" : "Submit Rating"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= RELATED PRODUCTS (FULL WIDTH) ================= */}
//       <div className={styles.relatedSection}>
//         <h3 className={styles.relatedTitle}>Related Products</h3>

//         {relatedLoading && <p>Loading related products...</p>}

//         {!relatedLoading && relatedProducts.length === 0 && (
//           <p>No related products found.</p>
//         )}

//         <div className={styles.relatedGrid}>
//           {relatedProducts.map((item) => (
//             <div
//               key={item.product_id}
//               className={styles.relatedCard}
//               onClick={() => navigate(`/app/product/${item.product_id}`)}
//             >
//               <img
//                 src={item.product_url || placeholder}
//                 alt={item.product_name}
//                 className={styles.relatedImage}
//               />
//               <h4>{item.product_name}</h4>
//               <p>
//                 ₹ {Number(item.product_price).toLocaleString("en-IN")}
//               </p>
//               <p>⭐ {item.rating_avg}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ================= RECENTLY VIEWED ================= */}
//       <div className={styles.relatedSection}>
//         <h3 className={styles.relatedTitle}>Recently Viewed</h3>

//         <div className={styles.relatedGrid}>
//           {recentProducts.map((item) => (
//             <div
//               key={item.product_id}
//               className={styles.relatedCard}
//               onClick={() => navigate(`/app/product/${item.product_id}`)}
//             >
//               <img
//                 src={item.thumbnail || placeholder}
//                 alt={item.product_name}
//                 className={styles.relatedImage}
//               />
//               <h4>{item.product_name}</h4>
//               <p>₹ {Number(item.price).toLocaleString("en-IN")}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//     </>
//   );
// }; export default ProductDetails;

// import React, { useState, useMemo, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ImageZoom from "../ImageZoom/ImageZoom";
// import styles from "./ProductDetails.module.css";
// import toast, { Toaster } from "react-hot-toast";
// import placeholder from "../../assets/no-image.png";
// import axios from "axios";

// import { useDispatch } from "react-redux";
// import { addOrUpdateItem } from "../../store/slices/cartSlice";
// import StarRating from "../Rating/StarRating";

// const ProductDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [rawProduct, setRawProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [avgRating, setAvgRating] = useState(0);
//   const [ratingCount, setRatingCount] = useState(0);
//   const [myRating, setMyRating] = useState(0);
//   const [review, setReview] = useState("");

//   const [qty, setQty] = useState(1);
//   const [isInCart, setIsInCart] = useState(false);
//   const dispatch = useDispatch();
//   const [currIndex, setCurrIndex] = useState(0);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const [qaData, setQaData] = useState([]);
//   const [newQuestion, setNewQuestion] = useState("");

//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [relatedLoading, setRelatedLoading] = useState(false);

//   const [recentProducts, setRecentProducts] = useState([]);

//   /* ================= FETCH RATINGS ================= */
//   const fetchRatings = async (ownerType) => {
//     if (!id || !ownerType) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:3000/api/product/ratings/${id}/${ownerType}`,
//         { withCredentials: true }
//       );
//       if (res.data.success) {
//         setAvgRating(res.data.avg_rating || 0);
//         setRatingCount(res.data.rating_count || 0);
//         if (res.data.my_rating) {
//           setMyRating(res.data.my_rating.rating);
//           setReview(res.data.my_rating.review || "");
//         }
//       }
//     } catch (err) {
//       console.log("Rating fetch error");
//     }
//   };

//   /* ================= PRODUCT MEMO ================= */
//   const product = useMemo(() => {
//     if (!rawProduct) return null;

//     // 🔍 DEBUG — rawProduct ka poora data dekho
//     console.log("🔍 RAW PRODUCT DATA:", rawProduct);
//     console.log("🔍 remaining_stock field:", rawProduct.remaining_stock);
//     console.log("🔍 stock field:", rawProduct.stock);
//     console.log("🔍 owner_type:", rawProduct.owner_type);

//     let images = [];
//     if (Array.isArray(rawProduct.images)) {
//       images = rawProduct.images;
//     } else if (typeof rawProduct.images === "string") {
//       try {
//         const parsed = JSON.parse(rawProduct.images);
//         if (Array.isArray(parsed)) images = parsed;
//       } catch {
//         images = [];
//       }
//     }

//     if (!images.length) images = [placeholder];

//     return {
//       ...rawProduct,
//       image: images,
//       title: rawProduct.product_name || "Product",
//       price: rawProduct.product_price || 0,
//       brand: rawProduct.brand || "—",
//       rating: rawProduct.rating_avg || "—",
//       ownerType: rawProduct.owner_type,
//       moq: rawProduct.wholesale_moq || 1,
//       stock: rawProduct.remaining_stock ?? rawProduct.stock ?? null,
//     };
//   }, [rawProduct]);

//   const isSupplier = product?.ownerType === "supplier";

//   // 🔥 STOCK STATUS HELPERS
//   const isOutOfStock = product?.ownerType === "seller" &&
//     product?.stock !== null &&
//     Number(product?.stock) === 0;

//   const isComingSoon = product?.ownerType === "seller" &&
//     (product?.stock === null || product?.stock === undefined);

//   const isUnavailable = isOutOfStock || isComingSoon;

//   // 🔍 DEBUG — stock status dekho
//   if (product) {
//     console.log("🔍 product.stock:", product.stock);
//     console.log("🔍 product.ownerType:", product.ownerType);
//     console.log("🔍 isOutOfStock:", isOutOfStock);
//     console.log("🔍 isComingSoon:", isComingSoon);
//     console.log("🔍 isUnavailable:", isUnavailable);
//   }

//   /* ================= FETCH PRODUCT ================= */
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         alert(id);
//         console.log("🔍 Fetching product id:", id);

//         const res = await fetch(
//           `http://localhost:3000/api/publics/product/${id}`
//         );
//         const json = await res.json();

//         console.log("🔍 API RESPONSE:", json); // poora response dekho

//         if (!json.success || !json.product) {
//           throw new Error("Product not found");
//         }
//         setRawProduct(json.product);
//         setError("");
//       } catch (err) {
//         console.error("FETCH PRODUCT ERROR:", err);
//         setError("Product not found");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProduct();
//   }, [id]);

//   /* ================= RECENTLY VIEWED SAVE ================= */
//   useEffect(() => {
//     if (!product?.product_id) return;
//     const key = "recent_products";
//     let items = JSON.parse(localStorage.getItem(key)) || [];
//     items = items.filter((i) => i !== product.product_id);
//     items.unshift(product.product_id);
//     items = items.slice(0, 10);
//     localStorage.setItem(key, JSON.stringify(items));
//   }, [product?.product_id]);

//   useEffect(() => {
//     if (rawProduct?.owner_type) {
//       fetchRatings(rawProduct.owner_type);
//     }
//   }, [id, rawProduct?.owner_type]);

//   useEffect(() => {
//     if (id) {
//       fetchQA();
//       fetchRelatedProducts();
//     }
//   }, [id]);

//   useEffect(() => {
//     const ids = JSON.parse(localStorage.getItem("recent_products")) || [];
//     if (!ids.length) return;
//     axios
//       .get(`http://localhost:3000/api/products/recent?ids=${ids.join(",")}`)
//       .then((res) => setRecentProducts(res.data))
//       .catch(() => {});
//   }, [product?.product_id]);

//   useEffect(() => {
//     if (!product) return;
//     if (product.ownerType === "supplier") {
//       setQty(product.moq);
//     } else {
//       setQty(1);
//     }
//   }, [product?.ownerType, product?.moq]);

//   useEffect(() => {
//     setImageLoaded(false);
//   }, [currIndex]);

//   useEffect(() => {
//     const checkCart = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/cart", {
//           withCredentials: true,
//         });
//         const items = Array.isArray(res.data) ? res.data : [];
//         const exists = items.some(
//           (item) =>
//             item.product_id === product.product_id &&
//             item.owner_type === product.ownerType
//         );
//         setIsInCart(exists);
//       } catch (err) {
//         console.log("Cart not available yet");
//       }
//     };
//     if (product?.product_id && product?.ownerType) {
//       checkCart();
//     }
//   }, [product?.product_id, product?.ownerType]);

//   /* ================= SUBMIT RATING ================= */
//   const submitRating = async () => {
//     if (!product) return;
//     if (!myRating) return toast.error("Select rating first");
//     try {
//       await axios.post(
//         "http://localhost:3000/api/product/rating",
//         {
//           product_id: product.product_id,
//           rating: myRating,
//           review,
//           owner_type: product.ownerType,
//         },
//         { withCredentials: true }
//       );
//       toast.success("Rating submitted");
//       await fetchRatings(product.ownerType);
//       const res = await fetch(`http://localhost:3000/api/publics/product/${id}`);
//       const json = await res.json();
//       if (json.success) setRawProduct(json.product);
//     } catch {
//       toast.error("Login required to rate");
//     }
//   };

//   /* ================= Q & A ================= */
//   const handleAskQuestion = async () => {
//     if (!newQuestion.trim()) return;
//     try {
//       await axios.post(
//         "http://localhost:3000/api/product/qa/ask",
//         { product_id: id, question: newQuestion },
//         { withCredentials: true }
//       );
//       setNewQuestion("");
//       fetchQA();
//     } catch {
//       toast.error("Login required");
//     }
//   };

//   const fetchRelatedProducts = async () => {
//     try {
//       setRelatedLoading(true);
//       const res = await axios.get(`http://localhost:3000/api/public/${id}/related`);
//       setRelatedProducts(res.data || []);
//     } catch (err) {
//       console.log("Related fetch error");
//     } finally {
//       setRelatedLoading(false);
//     }
//   };

//   const fetchQA = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/product/qa/${id}`);
//       if (res.data.success) {
//         const rows = res.data.data;
//         const grouped = [];
//         rows.forEach((row) => {
//           let existing = grouped.find((q) => q.id === row.question_id);
//           if (!existing) {
//             existing = {
//               id: row.question_id,
//               question: row.question,
//               created_at: row.created_at,
//               answers: [],
//             };
//             grouped.push(existing);
//           }
//           if (row.answer_id) {
//             existing.answers.push({
//               id: row.answer_id,
//               text: row.answer,
//               by: row.answered_by,
//               isSeller: row.answered_by === "seller",
//             });
//           }
//         });
//         setQaData(grouped);
//       }
//     } catch (err) {
//       console.log("QA fetch error");
//     }
//   };

//   /* ================= ADD TO CART ================= */
//   const handleAddToCart = async () => {
//     if (isOutOfStock) {
//       return toast.error("❌ Product is out of stock");
//     }
//     if (isComingSoon) {
//       return toast.error("⏳ Product coming soon, not available yet");
//     }

//     try {
//       dispatch(
//         addOrUpdateItem({
//           product_id: product.product_id,
//           quantity: qty,
//           owner_type: product.ownerType,
//           price: product.price,
//         })
//       );

//       await axios.post(
//         "http://localhost:3000/api/cart/add",
//         { product_id: product.product_id, quantity: qty },
//         { withCredentials: true }
//       );

//       toast.success("Product added to cart");
//       setIsInCart(true);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Add to cart failed");
//     }
//   };

//   /* ================= BUY NOW ================= */
//   const handleBuyNow = async () => {
//     if (isOutOfStock) {
//       return toast.error("❌ Product is out of stock");
//     }
//     if (isComingSoon) {
//       return toast.error("⏳ Product coming soon, not available yet");
//     }

//     if (isSupplier) {
//       return toast.error("Supplier products are pickup only");
//     }

//     try {
//       if (!isInCart) {
//         await axios.post(
//           "http://localhost:3000/api/cart/add",
//           { product_id: product.product_id, quantity: qty },
//           { withCredentials: true }
//         );
//       }
//       navigate("/app/checkout");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Please login to continue");
//     }
//   };

//   /* ================= STATES ================= */
//   if (loading) {
//     return <h2 style={{ textAlign: "center" }}>Loading product...</h2>;
//   }

//   if (error || !product) {
//     return <h2 style={{ textAlign: "center" }}>Product not found!</h2>;
//   }

//   /* ================= UI ================= */
//   return (
//     <>
//       <Toaster position="top-center" />

//       <div className={styles.productContainer}>
//         {/* LEFT */}
//         <div className={styles.imageSection}>
//           <div className={styles.thumbnailList}>
//             {product.image.map((img, index) => (
//               <img
//                 key={index}
//                 src={img || placeholder}
//                 alt=""
//                 loading="lazy"
//                 decoding="async"
//                 className={`${styles.thumbnail} ${
//                   index === currIndex ? styles.activeThumb : ""
//                 }`}
//                 onClick={() => setCurrIndex(index)}
//               />
//             ))}
//           </div>

//           <div className={styles.mainImage}>
//             {!imageLoaded && <div className={styles.imageSkeleton} />}

//             <img
//               src={product.image[currIndex] || placeholder}
//               alt={product.title}
//               className={`${styles.mainProductImage} ${isUnavailable ? styles.imageBlurred : ""}`}
//               loading="lazy"
//               decoding="async"
//               onLoad={() => setImageLoaded(true)}
//               style={{ display: imageLoaded ? "block" : "none" }}
//             />

//             {isOutOfStock && (
//               <div className={styles.stockBadgeLarge} style={{ background: "#e53935" }}>
//                 Out of Stock
//               </div>
//             )}
//             {isComingSoon && (
//               <div className={styles.stockBadgeLarge} style={{ background: "#f57c00" }}>
//                 Coming Soon
//               </div>
//             )}

//             {imageLoaded && !isUnavailable && (
//               <ImageZoom
//                 src={product.image[currIndex] || placeholder}
//                 containerClass={styles.zoomOverlay}
//               />
//             )}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className={styles.detailsSection}>
//           <h2 className={styles.productTitle}>{product.title}</h2>

//           <p className={styles.productBrand}>Brand: {product.brand}</p>

//           <div className={styles.ratingBox}>
//             <StarRating value={avgRating} readOnly />
//             <span className={styles.ratingText}>
//               {avgRating.toFixed(1)} / 5 ({ratingCount} ratings)
//             </span>
//           </div>

//           {product.ownerType === "supplier" && (
//             <p className={styles.moqText}>
//               Minimum Order Quantity:
//               <strong> {product.moq}</strong>
//             </p>
//           )}

//           <div className={styles.priceBox}>
//             ₹ {Number(product.price).toLocaleString("en-IN")}
//             <span className={styles.taxText}> (Incl. of all taxes)</span>
//           </div>

//           {isOutOfStock && (
//             <div className={styles.stockStatusBox} style={{ background: "#fff0f0", border: "1px solid #e53935", color: "#e53935" }}>
//               ❌ This product is currently <strong>Out of Stock</strong>
//             </div>
//           )}
//           {isComingSoon && (
//             <div className={styles.stockStatusBox} style={{ background: "#fff8f0", border: "1px solid #f57c00", color: "#f57c00" }}>
//               ⏳ This product is <strong>Coming Soon</strong>
//             </div>
//           )}

//           {isSupplier && (
//             <div style={{ marginTop: 10, padding: "10px 14px", background: "#f1f8ff", border: "1px dashed #2874f0", borderRadius: 8, color: "#0b5ed7", fontSize: 14, fontWeight: 500 }}>
//               🏭 <strong>Self Pickup Only</strong>
//               <br />
//               Buyer will collect goods directly from supplier warehouse.
//             </div>
//           )}

//           <div className={styles.buttonGroup}>
//             {!isInCart ? (
//               <button
//                 className={`${styles.addToCart} ${isUnavailable ? styles.btnDisabled : ""}`}
//                 onClick={handleAddToCart}
//                 disabled={isUnavailable}
//               >
//                 {isSupplier ? "Add for Pickup" : "Add to Cart"}
//               </button>
//             ) : (
//               <button className={styles.goToCart} onClick={() => navigate("/app/cart")}>
//                 Go to Cart
//               </button>
//             )}

//             {!isSupplier && (
//               <button
//                 className={`${styles.buyNow} ${isUnavailable ? styles.btnDisabled : ""}`}
//                 onClick={handleBuyNow}
//                 disabled={isUnavailable}
//               >
//                 Buy Now
//               </button>
//             )}
//           </div>

//           <div className={styles.sellerCard}>
//             <div className={styles.sellerHeader}>
//               <h4>Sold By ({product.ownerType === "supplier" ? "Supplier" : "Seller"})</h4>
//               {product.approval_status === "approved" && (
//                 <span className={styles.verifiedBadge}>✔ Verified {product.ownerType}</span>
//               )}
//             </div>

//             <div className={styles.sellerRow}>
//               <span className={styles.label}>{product.ownerType === "supplier" ? "Supplier Name" : "Seller Name"}</span>
//               <span className={styles.value}>{product.seller_name}</span>
//             </div>

//             <div className={styles.sellerRow}>
//               <span className={styles.label}>Company</span>
//               <span className={styles.value}>{product.company_name}</span>
//             </div>

//             <div className={styles.sellerRow}>
//               <span className={styles.label}>Location</span>
//               <span className={styles.value}>{product.branch_city}, {product.branch_state}</span>
//             </div>

//             {product.short_description && (
//               <div className={styles.sellerDesc}>
//                 <strong>Short Description</strong>
//                 <p>{product.short_description}</p>
//               </div>
//             )}

//             {product.long_description && (
//               <div className={styles.productDescription}>
//                 <h3>Product Description</h3>
//                 <p style={{ whiteSpace: "pre-line" }}>{product.long_description}</p>
//               </div>
//             )}

//             <div className={styles.qaSection}>
//               <h3 className={styles.qaTitle}>Questions & Answers</h3>
//               <div className={styles.askQuestionBox}>
//                 <input
//                   type="text"
//                   placeholder="Have a question? Ask here"
//                   value={newQuestion}
//                   onChange={(e) => setNewQuestion(e.target.value)}
//                 />
//                 <button onClick={handleAskQuestion}>Ask</button>
//               </div>
//               {qaData.length === 0 && <p style={{ marginTop: 10 }}>No questions yet.</p>}
//               {qaData.map((qa) => (
//                 <div key={qa.id} className={styles.qaItem}>
//                   <p className={styles.questionText}>Q: {qa.question}</p>
//                   {qa.answers.map((ans) => (
//                     <div key={ans.id} className={styles.answerBox}>
//                       <div className={styles.answerHeader}>
//                         <span className={styles.answerBy}>{ans.by}</span>
//                         {ans.isSeller && <span className={styles.sellerBadge}>Seller</span>}
//                       </div>
//                       <p className={styles.answerText}>{ans.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>

//             <div className={styles.productRatingBox}>
//               <h4 className={styles.ratingTitle}>Rate this product</h4>
//               <StarRating value={myRating} onChange={setMyRating} />
//               <p className={styles.ratingInfo}>{avgRating} ★ average from {ratingCount} ratings</p>
//               <textarea
//                 className={styles.reviewInput}
//                 placeholder="Write a review (optional)"
//                 value={review}
//                 onChange={(e) => setReview(e.target.value)}
//               />
//               <button className={styles.submitRatingBtn} onClick={submitRating}>
//                 {myRating ? "Update Rating" : "Submit Rating"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className={styles.relatedSection}>
//         <h3 className={styles.relatedTitle}>Related Products</h3>
//         {relatedLoading && <p>Loading related products...</p>}
//         {!relatedLoading && relatedProducts.length === 0 && <p>No related products found.</p>}
//         <div className={styles.relatedGrid}>
//           {relatedProducts.map((item) => (
//             <div key={item.product_id} className={styles.relatedCard} onClick={() => navigate(`/app/product/${item.product_id}`)}>
//               <img src={item.product_url || placeholder} alt={item.product_name} className={styles.relatedImage} />
//               <h4>{item.product_name}</h4>
//               <p>₹ {Number(item.product_price).toLocaleString("en-IN")}</p>
//               <p>⭐ {item.rating_avg}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className={styles.relatedSection}>
//         <h3 className={styles.relatedTitle}>Recently Viewed</h3>
//         <div className={styles.relatedGrid}>
//           {recentProducts.map((item) => (
//             <div key={item.product_id} className={styles.relatedCard} onClick={() => navigate(`/app/product/${item.product_id}`)}>
//               <img src={item.thumbnail || placeholder} alt={item.product_name} className={styles.relatedImage} />
//               <h4>{item.product_name}</h4>
//               <p>₹ {Number(item.price).toLocaleString("en-IN")}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductDetails;


//change today 21

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom"; // 🔥 useSearchParams add kiya
import ImageZoom from "../ImageZoom/ImageZoom";
import styles from "./ProductDetails.module.css";
import toast, { Toaster } from "react-hot-toast";
import placeholder from "../../assets/no-image.png";
import axios from "axios";

import { useDispatch } from "react-redux";
import { addOrUpdateItem } from "../../store/slices/cartSlice";
import StarRating from "../Rating/StarRating";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 URL se ?type=seller ya ?type=supplier padho
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type"); // "seller" | "supplier"

  const [rawProduct, setRawProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [review, setReview] = useState("");

  const [qty, setQty] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const dispatch = useDispatch();
  const [currIndex, setCurrIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [qaData, setQaData] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const [recentProducts, setRecentProducts] = useState([]);

  /* ================= FETCH RATINGS ================= */
  const fetchRatings = async (ownerType) => {
    if (!id || !ownerType) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/product/ratings/${id}/${ownerType}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setAvgRating(res.data.avg_rating || 0);
        setRatingCount(res.data.rating_count || 0);
        if (res.data.my_rating) {
          setMyRating(res.data.my_rating.rating);
          setReview(res.data.my_rating.review || "");
        }
      }
    } catch (err) {
      console.log("Rating fetch error");
    }
  };

  /* ================= PRODUCT MEMO ================= */
  const product = useMemo(() => {
    if (!rawProduct) return null;

    let images = [];
    if (Array.isArray(rawProduct.images)) {
      images = rawProduct.images;
    } else if (typeof rawProduct.images === "string") {
      try {
        const parsed = JSON.parse(rawProduct.images);
        if (Array.isArray(parsed)) images = parsed;
      } catch {
        images = [];
      }
    }

    if (!images.length) images = [placeholder];

    return {
      ...rawProduct,
      image: images,
      title: rawProduct.product_name || "Product",
      price: rawProduct.product_price || 0,
      brand: rawProduct.brand || "—",
      rating: rawProduct.rating_avg || "—",
      ownerType: rawProduct.owner_type,
      moq: rawProduct.wholesale_moq || 1,
      // 🔥 remaining_stock direct use karo — no fallback
      stock: rawProduct.remaining_stock,
    };
  }, [rawProduct]);

  const isSupplier = product?.ownerType === "supplier";

  // 🔥 STOCK STATUS — sirf seller ke liye
  const isOutOfStock = product?.ownerType === "seller" &&
    product?.stock !== null &&
    product?.stock !== undefined &&
    Number(product?.stock) === 0;

  const isComingSoon = product?.ownerType === "seller" &&
    (product?.stock === null || product?.stock === undefined);

  const isUnavailable = isOutOfStock || isComingSoon;

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        

        // 🔥 type URL param backend ko bhejo
        // Backend ab sahi table check karega seller ya supplier
        const url = typeFromUrl
          ? `http://localhost:3000/api/publics/product/${id}?type=${typeFromUrl}`
          : `http://localhost:3000/api/publics/product/${id}`;

        const res = await fetch(url);
        const json = await res.json();

        if (!json.success || !json.product) {
          throw new Error("Product not found");
        }

        setRawProduct(json.product);
        setError("");
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, typeFromUrl]); // 🔥 typeFromUrl bhi dependency me

  /* ================= RECENTLY VIEWED SAVE ================= */
  useEffect(() => {
    if (!product?.product_id) return;
    const key = "recent_products";
    let items = JSON.parse(localStorage.getItem(key)) || [];
    items = items.filter((i) => i !== product.product_id);
    items.unshift(product.product_id);
    items = items.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(items));
  }, [product?.product_id]);

  useEffect(() => {
    if (rawProduct?.owner_type) {
      fetchRatings(rawProduct.owner_type);
    }
  }, [id, rawProduct?.owner_type]);

  useEffect(() => {
    if (id) {
      fetchQA();
      fetchRelatedProducts();
    }
  }, [id]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("recent_products")) || [];
    if (!ids.length) return;
    axios
      .get(`http://localhost:3000/api/products/recent?ids=${ids.join(",")}`)
      .then((res) => setRecentProducts(res.data))
      .catch(() => {});
  }, [product?.product_id]);

  useEffect(() => {
    if (!product) return;
    if (product.ownerType === "supplier") {
      setQty(product.moq);
    } else {
      setQty(1);
    }
  }, [product?.ownerType, product?.moq]);

  useEffect(() => {
    setImageLoaded(false);
  }, [currIndex]);

  useEffect(() => {
    const checkCart = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/cart", {
          withCredentials: true,
        });
        const items = Array.isArray(res.data) ? res.data : [];
        const exists = items.some(
          (item) =>
            item.product_id === product.product_id &&
            item.owner_type === product.ownerType
        );
        setIsInCart(exists);
      } catch (err) {
        console.log("Cart not available yet");
      }
    };
    if (product?.product_id && product?.ownerType) {
      checkCart();
    }
  }, [product?.product_id, product?.ownerType]);

  /* ================= SUBMIT RATING ================= */
  const submitRating = async () => {
    if (!product) return;
    if (!myRating) return toast.error("Select rating first");
    try {
      await axios.post(
        "http://localhost:3000/api/product/rating",
        {
          product_id: product.product_id,
          rating: myRating,
          review,
          owner_type: product.ownerType,
        },
        { withCredentials: true }
      );
      toast.success("Rating submitted");
      await fetchRatings(product.ownerType);
      const url = typeFromUrl
        ? `http://localhost:3000/api/publics/product/${id}?type=${typeFromUrl}`
        : `http://localhost:3000/api/publics/product/${id}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setRawProduct(json.product);
    } catch {
      toast.error("Login required to rate");
    }
  };

  /* ================= Q & A ================= */
  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      await axios.post(
        "http://localhost:3000/api/product/qa/ask",
        { product_id: id, question: newQuestion },
        { withCredentials: true }
      );
      setNewQuestion("");
      fetchQA();
    } catch {
      toast.error("Login required");
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      setRelatedLoading(true);
      const res = await axios.get(`http://localhost:3000/api/public/${id}/related`);
      // AB — array ya .products dono handle
const list = Array.isArray(res.data) ? res.data : res.data.products || [];
setRelatedProducts(list);
    } catch (err) {
      console.log("Related fetch error");
    } finally {
      setRelatedLoading(false);
    }
  };

  const fetchQA = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/product/qa/${id}`);
      if (res.data.success) {
        const rows = res.data.data;
        const grouped = [];
        rows.forEach((row) => {
          let existing = grouped.find((q) => q.id === row.question_id);
          if (!existing) {
            existing = {
              id: row.question_id,
              question: row.question,
              created_at: row.created_at,
              answers: [],
            };
            grouped.push(existing);
          }
          if (row.answer_id) {
            existing.answers.push({
              id: row.answer_id,
              text: row.answer,
              by: row.answered_by,
              isSeller: row.answered_by === "seller",
            });
          }
        });
        setQaData(grouped);
      }
    } catch (err) {
      console.log("QA fetch error");
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (isOutOfStock) return toast.error("❌ Product is out of stock");
    if (isComingSoon) return toast.error("⏳ Product coming soon, not available yet");

    try {
      dispatch(
        addOrUpdateItem({
          product_id: product.product_id,
          quantity: qty,
          owner_type: product.ownerType,
          price: product.price,
        })
      );

      // await axios.post(
      //   "http://localhost:3000/api/cart/add",
      //   { product_id: product.product_id, quantity: qty },
      //   { withCredentials: true }
      // );

      // AB — owner_type bhi bhejo
await axios.post(
  "http://localhost:3000/api/cart/add",
  { product_id: product.product_id, quantity: qty, owner_type: product.ownerType },
  { withCredentials: true }
);

      toast.success("Product added to cart");
      setIsInCart(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Add to cart failed");
    }
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = async () => {
    if (isOutOfStock) return toast.error("❌ Product is out of stock");
    if (isComingSoon) return toast.error("⏳ Product coming soon, not available yet");
    if (isSupplier) return toast.error("Supplier products are pickup only");

    try {
      if (!isInCart) {
        await axios.post(
          "http://localhost:3000/api/cart/add",
         // AB
{ product_id: product.product_id, quantity: qty, owner_type: product.ownerType },
          { withCredentials: true }
        );
      }
      navigate("/app/checkout");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Please login to continue");
    }
  };

  /* ================= STATES ================= */
  if (loading) return <h2 style={{ textAlign: "center" }}>Loading product...</h2>;
  if (error || !product) return <h2 style={{ textAlign: "center" }}>Product not found!</h2>;

  /* ================= UI ================= */
  return (
    <>
      <Toaster position="top-center" />

      <div className={styles.productContainer}>
        {/* LEFT */}
        <div className={styles.imageSection}>
          <div className={styles.thumbnailList}>
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img || placeholder}
                alt=""
                loading="lazy"
                decoding="async"
                className={`${styles.thumbnail} ${index === currIndex ? styles.activeThumb : ""}`}
                onClick={() => setCurrIndex(index)}
              />
            ))}
          </div>

          <div className={styles.mainImage}>
            {!imageLoaded && <div className={styles.imageSkeleton} />}

            <img
              src={product.image[currIndex] || placeholder}
              alt={product.title}
              className={`${styles.mainProductImage} ${isUnavailable ? styles.imageBlurred : ""}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />

            {isOutOfStock && (
              <div className={styles.stockBadgeLarge} style={{ background: "#e53935" }}>
                Out of Stock
              </div>
            )}
            {isComingSoon && (
              <div className={styles.stockBadgeLarge} style={{ background: "#f57c00" }}>
                Coming Soon
              </div>
            )}

            {imageLoaded && !isUnavailable && (
              <ImageZoom
                src={product.image[currIndex] || placeholder}
                containerClass={styles.zoomOverlay}
              />
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.detailsSection}>
          <h2 className={styles.productTitle}>{product.title}</h2>
          <p className={styles.productBrand}>Brand: {product.brand}</p>

          <div className={styles.ratingBox}>
            <StarRating value={avgRating} readOnly />
            <span className={styles.ratingText}>
              {avgRating.toFixed(1)} / 5 ({ratingCount} ratings)
            </span>
          </div>

          {product.ownerType === "supplier" && (
            <p className={styles.moqText}>
              Minimum Order Quantity: <strong>{product.moq}</strong>
            </p>
          )}

          <div className={styles.priceBox}>
            ₹ {Number(product.price).toLocaleString("en-IN")}
            <span className={styles.taxText}> (Incl. of all taxes)</span>
          </div>

          {isOutOfStock && (
            <div className={styles.stockStatusBox} style={{ background: "#fff0f0", border: "1px solid #e53935", color: "#e53935" }}>
              ❌ This product is currently <strong>Out of Stock</strong>
            </div>
          )}
          {isComingSoon && (
            <div className={styles.stockStatusBox} style={{ background: "#fff8f0", border: "1px solid #f57c00", color: "#f57c00" }}>
              ⏳ This product is <strong>Coming Soon</strong>
            </div>
          )}

          {isSupplier && (
            <div style={{ marginTop: 10, padding: "10px 14px", background: "#f1f8ff", border: "1px dashed #2874f0", borderRadius: 8, color: "#0b5ed7", fontSize: 14, fontWeight: 500 }}>
              🏭 <strong>Self Pickup Only</strong><br />
              Buyer will collect goods directly from supplier warehouse.
            </div>
          )}

          <div className={styles.buttonGroup}>
            {!isInCart ? (
              <button
                className={`${styles.addToCart} ${isUnavailable ? styles.btnDisabled : ""}`}
                onClick={handleAddToCart}
                disabled={isUnavailable}
              >
                {isSupplier ? "Add for Pickup" : "Add to Cart"}
              </button>
            ) : (
              <button className={styles.goToCart} onClick={() => navigate("/app/cart")}>
                Go to Cart
              </button>
            )}

            {!isSupplier && (
              <button
                className={`${styles.buyNow} ${isUnavailable ? styles.btnDisabled : ""}`}
                onClick={handleBuyNow}
                disabled={isUnavailable}
              >
                Buy Now
              </button>
            )}
          </div>

          <div className={styles.sellerCard}>
            <div className={styles.sellerHeader}>
              <h4>Sold By ({product.ownerType === "supplier" ? "Supplier" : "Seller"})</h4>
              {product.approval_status === "approved" && (
                <span className={styles.verifiedBadge}>✔ Verified {product.ownerType}</span>
              )}
            </div>

            <div className={styles.sellerRow}>
              <span className={styles.label}>{product.ownerType === "supplier" ? "Supplier Name" : "Seller Name"}</span>
              <span className={styles.value}>{product.seller_name}</span>
            </div>
            <div className={styles.sellerRow}>
              <span className={styles.label}>Company</span>
              <span className={styles.value}>{product.company_name}</span>
            </div>
            <div className={styles.sellerRow}>
              <span className={styles.label}>Location</span>
              <span className={styles.value}>{product.branch_city}, {product.branch_state}</span>
            </div>

            {product.short_description && (
              <div className={styles.sellerDesc}>
                <strong>Short Description</strong>
                <p>{product.short_description}</p>
              </div>
            )}

            {product.long_description && (
              <div className={styles.productDescription}>
                <h3>Product Description</h3>
                <p style={{ whiteSpace: "pre-line" }}>{product.long_description}</p>
              </div>
            )}

            <div className={styles.qaSection}>
              <h3 className={styles.qaTitle}>Questions & Answers</h3>
              <div className={styles.askQuestionBox}>
                <input
                  type="text"
                  placeholder="Have a question? Ask here"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <button onClick={handleAskQuestion}>Ask</button>
              </div>
              {qaData.length === 0 && <p style={{ marginTop: 10 }}>No questions yet.</p>}
              {qaData.map((qa) => (
                <div key={qa.id} className={styles.qaItem}>
                  <p className={styles.questionText}>Q: {qa.question}</p>
                  {qa.answers.map((ans) => (
                    <div key={ans.id} className={styles.answerBox}>
                      <div className={styles.answerHeader}>
                        <span className={styles.answerBy}>{ans.by}</span>
                        {ans.isSeller && <span className={styles.sellerBadge}>Seller</span>}
                      </div>
                      <p className={styles.answerText}>{ans.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.productRatingBox}>
              <h4 className={styles.ratingTitle}>Rate this product</h4>
              <StarRating value={myRating} onChange={setMyRating} />
              <p className={styles.ratingInfo}>{avgRating} ★ average from {ratingCount} ratings</p>
              <textarea
                className={styles.reviewInput}
                placeholder="Write a review (optional)"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button className={styles.submitRatingBtn} onClick={submitRating}>
                {myRating ? "Update Rating" : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.relatedSection}>
        <h3 className={styles.relatedTitle}>Related Products</h3>
        {relatedLoading && <p>Loading related products...</p>}
        {!relatedLoading && relatedProducts.length === 0 && <p>No related products found.</p>}
        <div className={styles.relatedGrid}>
          {relatedProducts.map((item) => (
            <div key={item.product_id} className={styles.relatedCard} onClick={() => navigate(`/app/product/${item.product_id}?type=${item.source}`)}>
              <img src={item.product_url || placeholder} alt={item.product_name} className={styles.relatedImage} />
              <h4>{item.product_name}</h4>
              <p>₹ {Number(item.product_price).toLocaleString("en-IN")}</p>
              <p>⭐ {item.rating_avg}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.relatedSection}>
        <h3 className={styles.relatedTitle}>Recently Viewed</h3>
        <div className={styles.relatedGrid}>
          {recentProducts.map((item) => (
            <div key={item.product_id} className={styles.relatedCard} onClick={() => navigate(`/app/product/${item.product_id}`)}>
              <img src={item.thumbnail || placeholder} alt={item.product_name} className={styles.relatedImage} />
              <h4>{item.product_name}</h4>
              <p>₹ {Number(item.price).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;