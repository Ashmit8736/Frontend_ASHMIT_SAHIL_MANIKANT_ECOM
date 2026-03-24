import { useEffect, useState } from "react";
import styles from "./ScrollToTopButton.module.css";

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        visible && (
            <button
                className={styles.scrollTopBtn}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                ⬆️
            </button>
        )
    );
};

export default ScrollToTop;
