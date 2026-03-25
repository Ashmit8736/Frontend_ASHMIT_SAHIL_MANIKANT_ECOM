
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Product.module.css";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { getStockColors, statusColors } from "../statusColors/statusColors";

const API_BASE = "http://localhost:3000/api/supplier";
const CATEGORY_API = "http://localhost:3000/api/publices/categories/tree";

const authConfig = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("supplierToken")}`,
  },
};

const MAX_IMAGES = 4;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const SKU_REGEX = /^[A-Z0-9_-]+$/;

const validateProductStep = (step, data, category) => {
  if (step === 1) {
    if (!category.level1) return "Please select main category";
    if (!category.level2) return "Please select sub category";
    return null;
  }

  if (step === 2) {
    const {
      product_name, sku, short_description, long_description,
      wholesale_price, wholesale_moq, product_unit, total_stock, min_stock, gst_verified,
    } = data;

    if (!product_name || product_name.trim().length < 2) return "Product name must be at least 2 characters";
    if (!sku || /\s/.test(sku)) return "SKU is required (no spaces allowed)";
    if (!SKU_REGEX.test(sku)) return "SKU can contain only A-Z, 0-9, - and _";
    if (!wholesale_price || Number(wholesale_price) <= 0) return "Enter valid wholesale price";
    if (!wholesale_moq || Number(wholesale_moq) <= 0) return "Enter valid MOQ";
    if (!product_unit) return "Product unit is required";
    if (total_stock && Number(total_stock) < 0) return "Total stock cannot be negative";
    if (min_stock && total_stock && Number(min_stock) > Number(total_stock)) return "Min stock cannot exceed total stock";
    if (!short_description || short_description.length < 10) return "Short description must be at least 10 characters";
    if (!long_description || long_description.length < 20) return "Long description must be at least 20 characters";
    if (gst_verified) {
      const gst = gst_verified.trim().toUpperCase();
      if (!GST_REGEX.test(gst)) return "Invalid GST number format";
    }
    return null;
  }

  if (step === 3) {
    const hasImage = data.some((img) => img);
    if (!hasImage) return "Please upload at least one product image";
    return null;
  }

  return null;
};

const EMPTY_FORM = {
  product_name: "", sku: "", brand: "", short_description: "", long_description: "",
  wholesale_price: "", wholesale_moq: "", product_unit: "",
  total_stock: "", remaining_stock: "", 
  city: "", state: "", country: "", gst_verified: "",
};

const ProductManagement = () => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [level2List, setLevel2List] = useState([]);
  const [level3List, setLevel3List] = useState([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customParentId, setCustomParentId] = useState(null);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editId, setEditId] = useState(null);
  const [createdProductId, setCreatedProductId] = useState(null);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [images, setImages] = useState(Array(MAX_IMAGES).fill(null));
  const [viewProduct, setViewProduct] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  /* ================= CUSTOM CATEGORY ================= */
  const createCustomCategory = async () => {
    if (!customCategoryName || !customParentId) return;
    try {
      const res = await axios.post(`${API_BASE}/category/custom`, { category_name: customCategoryName, parent_id: customParentId }, authConfig);
      const newCat = res.data.data;
      const treeRes = await axios.get(CATEGORY_API);
      const tree = treeRes.data.categories || [];
      setCategoryTree(tree);
      if (newCat.level === 2) {
        setLevel2(newCat.id);
        const parent = tree.find((c) => c.id == level1);
        setLevel2List(parent?.children || []);
        setLevel3(""); setLevel3List([]);
      }
      if (newCat.level === 3) {
        setLevel3(newCat.id);
        const parent = tree.find((c) => c.id == level1)?.children?.find((c) => c.id == level2);
        setLevel3List(parent?.children || []);
      }
      setCustomCategoryName("");
      setCustomParentId(null);
      setShowCategoryModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      setCategoryTree(res.data.categories || []);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/paginated`, { params: { page, limit: 10 }, ...authConfig });
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch products error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [page]);

  /* ================= HELPERS ================= */
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "sku") {
      value = value.toUpperCase();
      if (/\s/.test(value)) return;
      if (!/^[A-Z0-9_-]*$/.test(value)) return;
    }
    if (name === "gst_verified") value = value.toUpperCase();
    setFormData({ ...formData, [name]: value });
  };

  const resetModal = () => {
    setOpen(false);
    setStep(1);
    setEditId(null);
    setCreatedProductId(null);
    setLevel1(""); setLevel2(""); setLevel3("");
    setLevel2List([]); setLevel3List([]);
    setImages(Array(MAX_IMAGES).fill(null));
    setFormData(EMPTY_FORM);
  };

  const prefillCategory = (category_master_id) => {
    for (const l1 of categoryTree) {
      for (const l2 of l1.children || []) {
        if (l2.id === category_master_id) {
          setLevel1(l1.id); setLevel2(l2.id); setLevel2List(l1.children); return;
        }
        for (const l3 of l2.children || []) {
          if (l3.id === category_master_id) {
            setLevel1(l1.id); setLevel2(l2.id); setLevel3(l3.id);
            setLevel2List(l1.children); setLevel3List(l2.children); return;
          }
        }
      }
    }
  };

  /* ================= CREATE ================= */
  const createProduct = async () => {
    const err = validateProductStep(2, formData, {});
    if (err) { alert(err); return; }
    const category_master_id = level3 || level2;
    if (!category_master_id) { alert("Please select category"); return; }
    const res = await axios.post(`${API_BASE}/products`, { ...formData, category_master_id }, authConfig);
    setCreatedProductId(res.data.product_id);
    setStep(3);
  };

  /* ================= UPDATE ================= */
  const updateProduct = async () => {
    const err = validateProductStep(2, formData, {});
    if (err) { alert(err); return; }
    const category_master_id = level3 || level2;
    await axios.put(`${API_BASE}/products/${editId}`, { ...formData, category_master_id }, authConfig);
    setStep(3);
  };

  /* ================= IMAGE UPLOAD ================= */
  const uploadImages = async () => {
    const newImages = images.filter(img => img && !img.isExisting);

    if (editId && newImages.length === 0) {
      resetModal();
      fetchProducts();
      return;
    }

    if (!editId && newImages.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    const data = new FormData();
    newImages.forEach((img) => data.append("image", img));

    const productId = editId || createdProductId;
    await axios.post(`${API_BASE}/products/${productId}/images`, data, authConfig);

    resetModal();
    fetchProducts();
  };

  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axios.delete(`${API_BASE}/products/${id}`, authConfig);
    fetchProducts();
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles.productArea}>
      <div className={styles.Heading}>
        <h2>Product Management</h2>
        <button className={styles.addproductbtn} onClick={() => { resetModal(); setOpen(true); }}>
          <IoMdAdd /> Add Product
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className={styles.productOverlay}>
          <div className={styles.productContent}>
            <IoMdClose onClick={resetModal} />

            {/* STEP 1 : CATEGORY */}
            {step === 1 && (
              <>
                <select value={level1} onChange={(e) => {
                  const id = e.target.value;
                  setLevel1(id); setLevel2(""); setLevel3("");
                  const c = categoryTree.find((x) => x.id == id);
                  setLevel2List(c?.children || []); setLevel3List([]);
                }}>
                  <option value="">Select Category</option>
                  {categoryTree.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                </select>

                {level2List.length > 0 && (
                  <select value={level2} onChange={(e) => {
                    const id = e.target.value;
                    if (id === "__add_new__") { setCustomParentId(level1); setShowCategoryModal(true); return; }
                    setLevel2(id); setLevel3("");
                    const c = level2List.find((x) => x.id == id);
                    setLevel3List(c?.children || []);
                  }}>
                    <option value="">Select Sub Category</option>
                    {level2List.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                    <option value="__add_new__">➕ Add New Sub Category</option>
                  </select>
                )}

                {level2 && (
                  <select value={level3} onChange={(e) => {
                    const id = e.target.value;
                    if (id === "__add_new__") { setCustomParentId(level2); setShowCategoryModal(true); return; }
                    setLevel3(id);
                  }}>
                    <option value="">Select Nested Category (optional)</option>
                    {level3List.map((c) => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                    <option value="__add_new__">➕ Add New Nested Category</option>
                  </select>
                )}

                <button onClick={() => {
                  const err = validateProductStep(1, null, { level1, level2 });
                  if (err) { alert(err); return; }
                  setStep(2);
                }}>Next</button>
              </>
            )}

            {/* STEP 2 : PRODUCT */}
            {step === 2 && (
              <>
                <input name="product_name" placeholder="Product Name" value={formData.product_name} onChange={handleChange} />
                <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} />
                <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
                <textarea name="short_description" placeholder="Short Description" value={formData.short_description} onChange={handleChange} />
                <textarea name="long_description" placeholder="Long Description" value={formData.long_description} onChange={handleChange} />
                <input name="wholesale_price" placeholder="Wholesale Price" value={formData.wholesale_price} onChange={handleChange} />
                <input name="wholesale_moq" placeholder="MOQ" value={formData.wholesale_moq} onChange={handleChange} />
                <input name="product_unit" placeholder="Unit" value={formData.product_unit} onChange={handleChange} />
                <input name="total_stock" placeholder="Total Stock" value={formData.total_stock} onChange={handleChange} />
                {/* ✅ Remaining Stock */}
                <input name="remaining_stock" placeholder="Remaining Stock" value={formData.remaining_stock} onChange={handleChange} />
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
                <input name="gst_verified" placeholder="GST Number" value={formData.gst_verified} onChange={handleChange} />

                <button onClick={editId ? updateProduct : createProduct}>
                  {editId ? "Update & Next" : "Next"}
                </button>
              </>
            )}

            {/* STEP 3 : IMAGES */}
            {step === 3 && (
              <>
                <div className={styles.imageGuidelines}>
                  <h4>Image Guidelines</h4>
                  <ul>
                    <li>Recommended size: <b>1000 × 1000 px</b> (Square)</li>
                    <li>Minimum size: <b>600 × 600 px</b></li>
                    <li>Format: JPG, PNG, WEBP</li>
                    <li>Max size: 2 MB per image</li>
                    <li>Background: White / light preferred</li>
                    <li>First image will be main product image</li>
                  </ul>
                </div>

                {images.map((img, i) => (
                  <div key={i} className={styles.imageBox}>
                    <div className={styles.preview}>
                      {img ? (
                        <img
                          src={img.isExisting ? img.preview : URL.createObjectURL(img)}
                          alt="preview"
                        />
                      ) : (
                        <span>1000 × 1000</span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.size > 2 * 1024 * 1024) { alert("Image must be less than 2MB"); return; }
                          const copy = [...images];
                          copy[i] = file;
                          setImages(copy);
                        }}
                      />
                      {img && (
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...images];
                            copy[i] = null;
                            setImages(copy);
                          }}
                          style={{
                            background: "#ffe5e5", color: "#d64545", border: "none",
                            borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontWeight: "600"
                          }}
                        >✕</button>
                      )}
                    </div>
                  </div>
                ))}

                <button onClick={uploadImages}>
                  {editId ? "Update Images" : "Finish"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const stock = getStockColors(p.remaining_stock);
            const status = statusColors.find((s) => s.status === p.status) || {};
            return (
              <tr key={p.product_id}>
                <td>
                  {Array.isArray(p.images) && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.product_name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : "—"}
                </td>
                <td>{p.product_name}</td>
                <td>{p.brand}</td>
                <td>₹{p.wholesale_price}</td>
                <td>
                  <span style={{ background: stock.bgCol, color: stock.color }}>
                    {p.remaining_stock}/{p.total_stock}
                  </span>
                </td>
                <td>
                  <span style={{ background: status.bgColor, color: status.colors }}>
                    {p.status}
                  </span>
                </td>
                <td className={styles.actionCell}>
                  <button className={styles.viewBtn} onClick={() => setViewProduct(p)}>View</button>

                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setEditId(p.product_id);
                      setFormData({
                        product_name: p.product_name || "",
                        sku: p.sku || "",
                        brand: p.brand || "",
                        short_description: p.short_description || "",
                        long_description: p.long_description || "",
                        wholesale_price: p.wholesale_price || "",
                        wholesale_moq: p.wholesale_moq || "",
                        product_unit: p.product_unit || "",
                        total_stock: p.total_stock || "",
                        remaining_stock: p.remaining_stock || "", // ✅
                        city: p.city || "",
                        state: p.state || "",
                        country: p.country || "",
                        gst_verified: p.gst_verified || "",
                      });
                      prefillCategory(p.category_master_id);

                      if (p.images?.length > 0) {
                        const existingImgs = p.images.map(url => ({ isExisting: true, preview: url }));
                        const padded = [...existingImgs, ...Array(Math.max(0, MAX_IMAGES - existingImgs.length)).fill(null)];
                        setImages(padded);
                      } else {
                        setImages(Array(MAX_IMAGES).fill(null));
                      }

                      setOpen(true);
                      setStep(2);
                    }}
                  >Edit</button>

                  <button className={styles.deleteBtn} onClick={() => deleteProduct(p.product_id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewProduct && (
        <div className={styles.productOverlay}>
          <div className={styles.viewModal}>
            <div className={styles.viewHeader}>
              <h3>{viewProduct.product_name}</h3>
              <IoMdClose className={styles.closeIcon} onClick={() => setViewProduct(null)} />
            </div>

            <div className={styles.viewBody}>
              <div className={styles.viewInfo}>
                <p><b>Brand:</b> {viewProduct.brand}</p>
                <p><b>Price:</b> ₹{viewProduct.wholesale_price}</p>
                <p><b>Unit:</b> {viewProduct.product_unit}</p>
                <p><b>Total Stock:</b> {viewProduct.total_stock}</p>
                <p><b>Remaining Stock:</b> {viewProduct.remaining_stock}</p>
                <div className={styles.descBox}>
                  <h4>Short Description</h4>
                  <p>{viewProduct.short_description}</p>
                </div>
                <div className={styles.descBox}>
                  <h4>Long Description</h4>
                  <p style={{ whiteSpace: "pre-line" }}>{viewProduct.long_description}</p>
                </div>
              </div>

              <div className={styles.viewImages}>
                {Array.isArray(viewProduct.images) && viewProduct.images.length > 0 ? (
                  viewProduct.images.map((img, i) => (
                    <img key={i} src={img} alt="product" className={styles.productImage} />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>

            <div className={styles.viewFooter}>
              <button className={styles.closeBtn} onClick={() => setViewProduct(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM CATEGORY MODAL ================= */}
      {showCategoryModal && (
        <div className={styles.productOverlay}>
          <div className={styles.productContent}>
            <IoMdClose onClick={() => { setShowCategoryModal(false); setCustomCategoryName(""); setCustomParentId(null); }} />
            <h3>Create Custom Category</h3>
            <input type="text" placeholder="Category name" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} />
            <button onClick={createCustomCategory} disabled={!customCategoryName}>Create</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;