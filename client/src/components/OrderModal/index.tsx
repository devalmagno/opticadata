import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import styles from "./styles.module.scss";

import PaymentModal from "../PaymentModal";

import { OrderInfo } from "../../pages/orders";
import { Installment } from "../../pages/orders";
import RemoveModal from "../RemoveOrderModal";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    currentOrder: OrderInfo;
    ordersInfo: OrderInfo[];
};

const OrderModal = ({
    showModal,
    setShowModal,
    currentOrder,
    ordersInfo,
}: Props) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [currentInstallment, setCurrentInstallment] = useState<Installment>();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleInstallment = (ins: Installment, index: number) => {
        setCurrentInstallment(ins);
        setCurrentIndex(index);
        setShowPaymentModal(!showPaymentModal);
        console.log(ordersInfo[0].workers);
    };

    const sortDates = (date1: Installment, date2: Installment) => {
        let newDate1 = date1.date.split('/').reverse().join('');
        let newDate2 = date2.date.split('/').reverse().join('');

        return newDate1 > newDate2 ? 1 : newDate1 < newDate2 ? -1 : 0;
    };

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
                                <table className={styles.products}>
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
                                        {currentOrder.workers.map((worker) =>
                                            worker.name ? (
                                                <tr key={worker.id}>
                                                    <td>{worker.name}</td>
                                                    <td>{worker.occupation}</td>
                                                </tr>
                                            ) : undefined
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.info}>
                                <div className={styles.container}>
                                    <strong>Status do pagamento</strong>
                                    {currentOrder.installment
                                        .map((ins) => ins.status)
                                        .includes(false) ? (
                                        <strong className={styles.pending}>
                                            PENDENTE
                                        </strong>
                                    ) : (
                                        <strong className={styles.paid}>
                                            PAGO
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
                                        {currentOrder.installment
                                            .sort(sortDates)
                                            .map((ins, index) => (
                                                <div
                                                    key={ins.id}
                                                    className={
                                                        ins.status
                                                            ? `${styles.box} ${styles.insPaid}`
                                                            : `${styles.box} ${styles.insPending}`
                                                    }
                                                    onClick={() => {
                                                        handleInstallment(
                                                            ins,
                                                            index
                                                        );
                                                    }}
                                                >
                                                    <strong>{index + 1}</strong>

                                                    <div
                                                        className={
                                                            styles.tooltip
                                                        }
                                                    >
                                                        {ins.date}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <span>
                                        *clique em uma parcela para quitar
                                    </span>
                                </div>

                                <div className={styles.button}>
                                    <button
                                        onClick={() => {
                                            setShowRemoveModal(
                                                !showRemoveModal
                                            );
                                        }}
                                    >
                                        Remover venda
                                        <IoMdTrash className={styles.icon} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showPaymentModal ? (
                        <PaymentModal
                            showModal={showPaymentModal}
                            setShowModal={setShowPaymentModal}
                            installment={currentInstallment!}
                            index={currentIndex}
                        />
                    ) : (
                        ""
                    )}

                    {showRemoveModal ? (
                        <RemoveModal
                            showModal={showRemoveModal}
                            setShowModal={setShowRemoveModal}
                            setShowOrderModal={setShowModal}
                            currentOrder={currentOrder}
                            ordersArray={ordersInfo}
                        />
                    ) : (
                        ""
                    )}
                </div>
            )}
        </>
    );
};

export default OrderModal;
