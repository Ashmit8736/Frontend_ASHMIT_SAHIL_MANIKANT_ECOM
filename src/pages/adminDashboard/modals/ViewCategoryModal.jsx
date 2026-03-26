

import styles from "./ViewCategoryModal.module.css";

const ViewCategoryModal = ({
    category,
    onClose,
    onEdit,
    onDisable,
    onDelete,
}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>Category Details</h3>

                {/* LEVEL 1 */}
                <div className={styles.levelBox}>
                    <img
                        src={category.image_url}
                        alt={category.category_name}
                        className={styles.image}
                    />
                    <p><b>Name:</b> {category.category_name}</p>
                    <p><b>Level:</b> {category.level}</p>
                </div>

                {/* LEVEL 2 */}
                {category.children?.length > 0 && (
                    <div className={styles.subSection}>
                        <h4>Sub Categories (Level 2)</h4>

                        {category.children.map((l2) => (
                            <div key={l2.id} className={styles.subItem}>
                                <div className={styles.row}>
                                    <span className={styles.name}>
                                        {l2.category_name}
                                    </span>

                                    <div className={styles.rowActions}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                onClose();
                                                onEdit(l2);
                                            }}
                                        >
                                            ➕ Add Level-3
                                        </button>

                                        {/* <button
                                            className={styles.disable}
                                            onClick={() => onDisable(l2.id)}
                                        >
                                            Disable
                                        </button> */}

                                        <button
                                            className={styles.delete}
                                            onClick={() => onDelete(l2.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* LEVEL 3 */}
                                {l2.children?.map((l3) => (
                                    <div
                                        key={l3.id}
                                        className={styles.nestedItem}
                                    >
                                        <span>{l3.category_name}</span>

                                        <div className={styles.rowActions}>
                                            {/* <button
                                                className={styles.disable}
                                                onClick={() =>
                                                    onDisable(l3.id)
                                                }
                                            >
                                                Disable
                                            </button> */}

                                            <button
                                                className={styles.delete}
                                                onClick={() =>
                                                    onDelete(l3.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        onClick={onClose}
                        className={styles.closeBtn}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCategoryModal;
