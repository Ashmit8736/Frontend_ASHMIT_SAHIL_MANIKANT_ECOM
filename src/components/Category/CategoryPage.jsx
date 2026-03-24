import CategorySidebar from "./CategorySidebar";
import CategoryProducts from "./CategoryProducts";
import styles from "./CategoryPage.module.css";

const CategoryPage = () => {
    return (
        <div className={styles.page}>
            <CategorySidebar />
            <CategoryProducts />
        </div>
    );
};

export default CategoryPage;
