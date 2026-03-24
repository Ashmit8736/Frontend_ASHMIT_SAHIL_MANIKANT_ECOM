import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../store/APi/axiosInstance";
import style from "./Category.module.css";
import { assets } from "../../assets/assets";

const CATEGORY_LIMIT = 12;

const Category = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/publices/categories");
                console.log("Fetched categories:", res.data);
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Category fetch error:", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className={style.container}>
            {/* HEADER */}
            <div className={style.header}>
                <div className={style.leftInfo}>
                    <h1>Source Category</h1>
                    <p>Explore millions of products across diverse categories</p>
                </div>

                <button
                    className={style.viewAllBtn}
                    onClick={() => navigate("/app/categories")}
                >
                    View All
                </button>
            </div>

            {/* CATEGORY GRID */}
            <div className={style.outer}>
                {categories.slice(0, CATEGORY_LIMIT).map((item) => (
                    <div
                        key={item.id}
                        className={style.imgCont}
                        onClick={() => navigate(`/app/category/${item.id}`)}
                    >
                        <img
                            src={item.image_url || assets.defaultCategory}
                            alt={item.name || item.category_name}
                        />
                        <p>{item.name || item.category_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
