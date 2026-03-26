import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../store/APi/axiosInstance";
import styles from "./CategorySidebar.module.css";

const CategorySidebar = () => {
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const res = await api.get("/publices/categories/tree");
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Sidebar category error:", err);
            }
        };
        fetchTree();
    }, []);

    const renderTree = (list) =>
        list.map((cat) => (
            <div key={cat.id} className={styles.item}>
                <div
                    className={`${styles.name} ${Number(id) === cat.id ? styles.active : ""
                        }`}
                    onClick={() => navigate(`/app/category/${cat.id}`)}
                >
                    {cat.category_name}
                </div>

                {cat.children?.length > 0 && (
                    <div className={styles.children}>
                        {renderTree(cat.children)}
                    </div>
                )}
            </div>
        ));

    return (
        <aside className={styles.sidebar}>
            <h3>All Categories</h3>
            {renderTree(categories)}
        </aside>
    );
};

export default CategorySidebar;
