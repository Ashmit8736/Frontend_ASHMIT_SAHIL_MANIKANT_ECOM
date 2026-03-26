import React, { useState } from "react";
import styles from "./StarRating.module.css";

const StarRating = ({
    value = 0,
    onChange,
    size = 24,
    readOnly = false,
}) => {
    const [hover, setHover] = useState(0);

    const handleClick = (rating) => {
        if (readOnly) return;
        onChange && onChange(rating);
    };

    return (
        <div className={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = hover
                    ? star <= hover
                    : star <= value;

                return (
                    <span
                        key={star}
                        className={`${styles.star} ${filled ? styles.filled : ""
                            } ${readOnly ? styles.readOnly : ""}`}
                        style={{ fontSize: size }}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => !readOnly && setHover(star)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;
