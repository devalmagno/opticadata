import styles from "./styles.module.scss";

const Loading = () => {
    return (
        <div className={styles.bg_modal}>
                <div className={styles.modal_content}>
                    <div className={styles.loader}></div>
                </div>
        </div>
    );
}

export default Loading;