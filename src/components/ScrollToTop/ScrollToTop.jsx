import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const container = document.querySelector(".pageContent");

        if (container) {
            container.scrollTo({
                top: 0,
                behavior: "instant", // route change pe smooth nahi chahiye
            });
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
