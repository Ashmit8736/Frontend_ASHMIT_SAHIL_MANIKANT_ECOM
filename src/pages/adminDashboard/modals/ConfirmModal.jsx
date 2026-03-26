import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({ title, text, danger, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{title}</h3>
                <p>{text}</p>

                <div className={styles.actions}>
                    <button onClick={onCancel} className={styles.cancel}>
                        Cancel
                    </button>
                    <button
                        className={danger ? styles.danger : styles.primary}
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
