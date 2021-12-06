import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Payment, Customer } from "../OrderSidebar";

import styles from "./styles.module.scss";

type Props = {
    orderPayment: Payment;
    setOrderPayment: Dispatch<SetStateAction<Payment>>;
    customer: Customer[];
};

const PaymentOrder = ({ orderPayment, setOrderPayment, customer }: Props) => {
    const [amount, setAmount] = useState(1);
    const [typeOfPayment, setTypeOfPayment] = useState("Dinheiro");
    const [isInstallments, setIsInstallments] = useState(false);
    const [paymentDates, setPaymentDates] = useState<Date[]>([new Date()]);

    const paymentOptions = ["Boleto", "Cartão de crédito", "Dinheiro", "Pix"];

    if (amount < 1) {
        setAmount(1);
    }

    useEffect(() => {
        if (typeOfPayment != "" && paymentDates != [])
            setOrderPayment({
                type_of_payment: typeOfPayment.toString(),
                payment_date: paymentDates,
            });
    }, []);

    const handlePaymentDate = (date: string) => {
        let formatedDate = new Date(date);
        let dateArray = [formatedDate];

        setPaymentDates([]);

        for (var i = 1; i < amount; i++) {
            formatedDate.setMonth(formatedDate.getMonth() + 1);

            dateArray.push(formatedDate);
        }

        setPaymentDates(dateArray);
    };

    return (
        <div className={styles.container}>
            <strong>Pagamento</strong>

            <div className={styles.orderProducts}>
                {paymentOptions.map((option, index) => (
                    <div
                        className={
                            typeOfPayment == option
                                ? `${styles.boxProd} ${styles.active}`
                                : styles.boxProd
                        }
                        tabIndex={index}
                        onClick={() => {
                            setTypeOfPayment(option);
                        }}
                    >
                        <span>{option}</span>
                    </div>
                ))}
            </div>

            <div className={styles.info}>
            {customer[0] != null ? 
                (
                <>
                <div className={`${styles.box} ${styles.installment}`}>
                    <strong>Parcelado?</strong>
                    <div className={styles.input}>
                        <input
                            type="checkbox"
                            name="installment"
                            id="installment"
                            onChange={() => {
                                setIsInstallments(!isInstallments);
                            }}
                        />
                        <span className={styles.available}>Sim</span>
                    </div>
                </div>

                <div className={`${styles.box} ${styles.amount}`}>
                    <strong>Quantidade de parcelas</strong>
                    <div
                        className={
                            isInstallments
                                ? styles.amountBox
                                : `${styles.amountBox} ${styles.disabled}`
                        }
                    >
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
                </div></>
                ) : <span className={styles.warning}>*Para pagamentos parcelados é necessário adicionar o cliente.</span>
            }

                <div className={`${styles.box} ${styles.installment}`}>
                    <strong>Data para pagamento das parcelas</strong>
                    <div className={styles.box}>
                        <div className={styles.inputBox}>
                            <input
                                type="date"
                                name="paymentdate"
                                id="paymentdate"
                                onChange={(e) => {
                                    handlePaymentDate(e.target.value);
                                }}
                            />
                            <div className={styles.bottom}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentOrder;
