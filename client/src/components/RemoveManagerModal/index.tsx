import { Dispatch, FormEvent, SetStateAction, useState } from "react";

import { Manager } from "../../pages/users";
import { api } from "../../services/api";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    manager: Manager;
    index: number;
    managersArray: Manager[];
};

const RemoverWorkerModal = ({ showModal, setShowModal, manager, index, managersArray }: Props) => {
    const [isButton, setIsButton] = useState(false);

    if (showModal) document.body.style.overflow = 'hidden';

    const handleRemoveUser = async (e: FormEvent) => {
        e.preventDefault();

        try {
            api.delete(`/managers/${manager.id}`).then(() => {
                managersArray.splice(index, 1);
                setShowModal(!showModal);
            });
        } catch (err) {
            alert("Não foi possível deletar este gerente.");
        }
    };

    return (
        <>
            {showModal && (
                <div className={styles.bg_modal}>
                    <div className={styles.content}>
                        <h3>Remover gerente</h3>
                        <div className={styles.field}>
                            <span>
                                Tem certeza que deseja remover{" "}
                                <strong>{manager.name}</strong> do sistema?
                            </span>
                        </div>
                        <form onSubmit={handleRemoveUser}>
                            <div className={styles.radio}>
                                <input
                                    type="checkbox"
                                    name="payment"
                                    id="payment"
                                    onClick={() => {
                                        setIsButton(!isButton);
                                    }}
                                    required
                                />
                                <label htmlFor="payment"></label>
                                <span>
                                    Sim, eu tenho certeza e sei o que estou
                                    fazendo.
                                </span>
                            </div>

                            <div
                                className={
                                    isButton
                                        ? `${styles.buttons} ${styles.active}`
                                        : styles.buttons
                                }
                            >
                                <input
                                    type="submit"
                                    value="Remover"
                                    className={styles.buttonStyle}
                                />
                                <button
                                    onClick={() => {
                                        setShowModal(!showModal);
                                    }}
                                    className={styles.buttonStyle}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default RemoverWorkerModal;
