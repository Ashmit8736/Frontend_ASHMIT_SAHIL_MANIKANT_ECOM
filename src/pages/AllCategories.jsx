import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../store/APi/axiosInstance";
import styles from "../PagesStyles/AllCategories.module.css";
import { assets } from "../assets/assets";

const ITEMS_PER_LOAD = 12; // 🔥 load more batch size

const AllCategories = () => {
    const [categories, setCategories] = useState([]);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await api.get("/publices/categories");
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("All categories fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const openCategory = (id) => {
        navigate(`/app/category/${id}`);
    };

    const loadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
    };

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading categories...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>All Categories</h1>
                <p>Browse all available product categories</p>
            </div>

            <div className={styles.grid}>
                {categories.slice(0, visibleCount).map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        onClick={() => openCategory(item.id)}
                    >
                        <img
                            src={item.image_url || assets.defaultCategory}
                            alt={item.name || item.category_name}
                        />
                        <p>{item.name || item.category_name}</p>
                    </div>
                ))}
            </div>

            {visibleCount < categories.length && (
                <div className={styles.loadMoreWrapper}>
                    <button onClick={loadMore} className={styles.loadMoreBtn}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllCategories;
