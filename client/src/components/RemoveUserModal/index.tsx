import Router from "next/router";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

import { Worker } from "../../pages/users";
import { api } from "../../services/api";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    worker: Worker;
};

const RemoveUserModal = ({ showModal, setShowModal, worker }: Props) => {
    const [isButton, setIsButton] = useState(false);

    const handleRemoveUser = async (e: FormEvent) => {
        e.preventDefault();

        try {
            api.delete(`/workers/${worker.id}`).then(() => {
                setShowModal(!showModal);
                Router.push('/').then(() => {
                    Router.push('/users');
                });
            });
        } catch (err) {
            alert("Não foi possível.");
        }
    };

    return (
        <>
            {showModal && (
                <div className={styles.bg_modal}>
                    <div className={styles.content}>
                        <h3>Remover registro de venda</h3>
                        <div className={styles.field}>
                            <span>
                                Tem certeza que deseja remover{" "}
                                <strong>{worker.name}</strong> do sistema?
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

export default RemoveUserModal;
