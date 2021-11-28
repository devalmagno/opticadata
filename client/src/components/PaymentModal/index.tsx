import { Dispatch, FormEvent, SetStateAction, useState } from "react";

import { Installment } from "../../pages/orders";
import { api } from "../../services/api";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    installment: Installment;
    index: number;
};

const PaymentModal = ({ showModal, setShowModal, installment, index }: Props) => {
    const [isButton, setIsButton] = useState(false);

    const handlePayment = async (e: FormEvent) => {
        e.preventDefault();

        installment.status = true;

        try {
            api.put(`/installments/${installment.id}`, {
                status: true
            }).then(() => {
                setShowModal(!showModal);
            })
        } catch(err) {
            alert("Não foi possível.")
        }
    }

    return (
        <>
            {showModal && (
                <div className={styles.bg_modal}>
                    <div className={styles.content}>
                        <h3>Registrar pagamento da {index + 1}º parcela</h3>
                        <div className={styles.field}>
                            <strong>Data agendada: </strong>
                            <span>{installment.date}</span>
                        </div>
                        <div className={styles.field}>
                            <strong>Valor da parcela: </strong>
                            <span>R$ {installment.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <form onSubmit={handlePayment}>
                            <div className={styles.radio}>
                                <input 
                                    type="checkbox" 
                                    name="payment" 
                                    id="payment" 
                                    onClick={() => {
                                        setIsButton(!isButton)
                                    }}
                                    required 
                                />
                                <label htmlFor="payment"></label>
                                <span>Sim, tenho certeza que desejo registrar o pagamento desta parcela.</span>
                            </div>

                            <div className={isButton ? `${styles.buttons} ${styles.active}` : styles.buttons}>
                            <input 
                                type="submit" 
                                value="Confirmar" 
                                className={styles.buttonStyle}
                            />
                            <button 
                                onClick={() => { setShowModal(!showModal) }}
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
}

export default PaymentModal;