import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import styles from "./styles.module.scss";

import { OrderInfo } from "../../pages/orders";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    currentOrder: OrderInfo;
};

const OrderModal = ({ showModal, setShowModal, currentOrder }: Props) => {
    const [paymentStatus, setPaymentStatus] = useState(false);

    useEffect(() => {
        const status = currentOrder.installment.map((ins) => ins.status);

        if (status.includes(false)) return;

        setPaymentStatus(true);
    }, []);

    return (
        <>
            {showModal && (
                <div className={styles.bg_modal}>
                    <div className={styles.modal_content}>
                        <div className={styles.header}>
                            <h3>Informações sobre a venda</h3>
                            <div
                                className={styles.box_close}
                                onClick={() => {
                                    setShowModal(!showModal);
                                }}
                            >
                                <div className={styles.close}></div>
                                <div className={styles.close}></div>
                            </div>
                        </div>

                        <div className={styles.container}>
                            <div className={styles.infoTables}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Modelo</th>
                                            <th>Quantidade</th>
                                            <th>Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrder.products.map(
                                            (product) => (
                                                <tr key={product.id}>
                                                    <td>{product.name}</td>
                                                    <td
                                                        className={
                                                            styles.quantity
                                                        }
                                                    >
                                                        {product.quantity}
                                                    </td>
                                                    <td>
                                                        R${" "}
                                                        {product.price.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <table className={styles.workers}>
                                    <thead>
                                        <tr>
                                            <th>Funcionário</th>
                                            <th>Cargo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrder.workers.map((worker) => (
                                            <tr key={worker.id}>
                                                <td>{worker.name}</td>
                                                <td>{worker.occupation}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.container}>
                                    <strong>Status do pagamento</strong>
                                    {paymentStatus ? (
                                        <strong className={styles.paid}>
                                            PAGO
                                        </strong>
                                    ) : (
                                        <strong className={styles.pending}>
                                            PENDENTE
                                        </strong>
                                    )}
                                </div>
                                <div className={styles.container}>
                                    <strong>Pagamento</strong>
                                    <span>{currentOrder.payment}</span>
                                </div>
                                <div className={styles.container}>
                                    <strong>Tipo de pagamento</strong>
                                    <span>
                                        {currentOrder.installment.length > 1
                                            ? "parcelado"
                                            : "à vista"}
                                    </span>
                                </div>
                                <div className={styles.container}>
                                    <strong>Valor da parcela</strong>
                                    <span>
                                        {`${
                                            currentOrder.installment.length
                                        }x de R$ ${currentOrder.installment[0].price
                                            .toFixed(2)
                                            .replace(".", ",")}`}
                                    </span>
                                </div>
                                <div className={styles.container}>
                                    <strong>Valor total:</strong>
                                    <span>
                                        R${" "}
                                        {currentOrder.fullPrice
                                            .toFixed(2)
                                            .replace(".", ",")}
                                    </span>
                                </div>

                                <div className={styles.installments}>
                                    <strong>Parcelas</strong>

                                    <div className={styles.boxContainer}>
                                        {currentOrder.installment.map(
                                            (ins, index) => (
                                                <div
                                                    key={ins.id}
                                                    className={ins.status ? `${styles.box} ${styles.insPaid}` : `${styles.box} ${styles.insPending}`}
                                                >
                                                    <strong>{index + 1}</strong>

                                                    <div
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        {
                                                            ins.date
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <span>
                                        *clique em uma parcela para quitar
                                    </span>
                                </div>

                                <div className={styles.button}>
                                    <button>
                                        Remover venda
                                        <IoMdTrash className={styles.icon} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderModal;
