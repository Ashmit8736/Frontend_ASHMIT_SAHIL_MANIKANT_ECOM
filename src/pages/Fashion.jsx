import React, { useEffect, useState } from "react";
import api from "../store/APi/axiosInstance";
import Filter from "../components/Filter/Filter";
import ShowProduct from "../components/ShowProduct/ShowProduct";

import styles from "../PagesStyles/Fashion.module.css";

const Fashion = () => {
  const [products, setProducts] = useState([]);

  const fetchFashion = async () => {
    try {
      const res = await api.get("/public/category/fashion");
      setProducts(res.data.products || []);
    } catch (err) {
      console.log("Fashion fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFashion();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterSection}>
        <Filter />
      </div>

      <div className={styles.productsSection}>
        <ShowProduct products={products} />
      </div>
    </div>
  );
};

export default Fashion;
