import { Dispatch, SetStateAction, useState } from "react";

import { Payment } from "../OrderSidebar";

import styles from "./styles.module.scss";

type Props = {
    orderPayment: Payment[];
    setOrderPayment: Dispatch<SetStateAction<Payment[]>>;
};

const PaymentOrder = ({ orderPayment, setOrderPayment }: Props) => {
    const [amount, setAmount] = useState(0);
    const [selected, setSelected] = useState("");
    const paymentOptions = ["Boleto", "Cartão de crédito", "Dinheiro", "Pix"];

    if (amount < 0) {
        setAmount(0);
    }

    return (
        <div className={styles.container}>
            <strong>Pagamento</strong>

            <div className={styles.orderProducts}>
                {paymentOptions.map((option, index) => (
                    <div
                        className={
                            selected == option
                                ? `${styles.boxProd} ${styles.active}`
                                : styles.boxProd
                        }
                        tabIndex={index}
                        onClick={() => {
                            setSelected(option);
                        }}
                    >
                        <span>{option}</span>
                    </div>
                ))}
            </div>

            <div className={styles.info}>
                <div className={`${styles.box} ${styles.installment}`}>
                    <strong>Parcelado?</strong>
                    <div className={styles.input}>
                        <input
                            type="checkbox"
                            name="installment"
                            id="installment"
                        />
                        <span className={styles.available}>Sim</span>
                    </div>
                </div>

                <div className={`${styles.box} ${styles.amount}`}>
                    <strong>Quantidade de parcelas</strong>
                    <div className={styles.amountBox}>
                        <div
                            onClick={() => {
                                setAmount(amount - 1);
                            }}
                            className={`${styles.operator} ${styles.less}`}
                        >
                            -
                        </div>
                        <div className={styles.quantity}>{amount}</div>
                        <div
                            onClick={() => {
                                setAmount(amount + 1);
                            }}
                            className={`${styles.operator} ${styles.plus}`}
                        >
                            +
                        </div>
                    </div>
                </div>

                <div className={`${styles.box} ${styles.installment}`}>
                    <strong>Data para pagamento da 1º parcela</strong>
                    <div className={styles.box}>
                        <div className={styles.inputBox}>
                            <input
                                type="date"
                                name="paymentdate"
                                id="paymentdate"
                            />
                            <div className={styles.bottom}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={
                    // currentProduct != null && currentProduct.quantity > 0
                    /*?*/ styles.button
                    // : `${styles.button} ${styles.disabled}`
                }
            >
                <button
                    onClick={() => {
                        // currentProduct != null
                        //     ? handleOrderProducts(currentProduct)
                        //     : undefined;
                    }}
                >
                    Inserir parcela
                </button>
            </div>
        </div>
    );
};

export default PaymentOrder;
