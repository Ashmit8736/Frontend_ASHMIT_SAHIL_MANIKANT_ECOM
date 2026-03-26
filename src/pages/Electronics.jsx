import React, { useEffect, useState } from "react";
import api from "../store/APi/axiosInstance";
import Filter from "../components/Filter/Filter";
import ShowProduct from "../components/ShowProduct/ShowProduct";
import styles from "../PagesStyles/Electronics.module.css";

const Electronics = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/public/category/electronic")
      .then(res => setProducts(res.data.products || []))
      .catch(err => console.log(err));
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

export default Electronics;
