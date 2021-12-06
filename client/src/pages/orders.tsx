import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

import { BiInfoCircle } from "react-icons/bi";

import { useFetch } from "../hooks/useFetch";

import Header from "../components/Header";
import OrderModal from "../components/OrderModal";
import Loading from "../components/Loading";

import styles from "../styles/orders.module.scss";


export type Order = {
    id: string;
    payment_id: string;
    customer_id: string;
    created_at: Date;
    updated_at: Date;
};

export type Installment = {
    id: string;
    date: string;
    price: number;
    status: boolean;
};

type Products = {
    id: string;
    quantity: number;
    name: string;
    price: number;
};

type Workers = {
    id: string;
    name: string;
    occupation: string;
};

export type OrderInfo = {
    order: Order;
    payment: string;
    customer: string;
    fullPrice: number;
    installment: Installment[];
    products: Products[];
    workers: Workers[];
};

export default function Orders() {
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<OrderInfo>();

    const { data: orderInfo } = useFetch<OrderInfo[]>("/orders");
    if (!orderInfo) return <Loading />;

    if (!showModal) document.body.style.overflow = 'unset';

    orderInfo.map((info) => {
        info.fullPrice = info.installment[0].price * info.installment.length;
    });

    function handleModal(info: OrderInfo) {
        setCurrentOrder(info);
        setShowModal(!showModal);
    }

    return (
        <div className={styles.container}>
            <Header title="Vendas" />

            <table>
                <thead>
                    <tr>
                        <th>Preço</th>
                        <th>Pagamento</th>
                        <th>Tipo de pagamento</th>
                        <th>Status</th>
                        <th>Cliente</th>
                        <th>Sobre</th>
                    </tr>
                </thead>
                <tbody>
                    {orderInfo.slice(0).reverse().map((info) => {
                        return (
                            <tr key={info.order.id}>
                                <td>R$ {info.fullPrice.toFixed(2)}</td>
                                <td>{info.payment}</td>
                                <td>
                                    {info.installment.length > 1
                                        ? "parcelado"
                                        : "à vista"}
                                </td>
                                <td
                                    className={
                                        info.installment[0].status
                                            ? styles.paid
                                            : styles.pending
                                    }
                                >
                                    {info.installment[0].status
                                        ? "Pago"
                                        : "Pendente"}
                                </td>
                                <td>
                                    {info.customer}
                                </td>
                                <td
                                    onClick={() => { handleModal(info) }}
                                >
                                    <BiInfoCircle className={styles.icon} />
                                    <div className={styles.tooltip}>
                                        <span>Informações e Remoção</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showModal ? <OrderModal 
                showModal={showModal} 
                setShowModal={setShowModal}
                currentOrder={currentOrder!} 
                ordersInfo={orderInfo}
            /> : ''}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { "opdauth.token": token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
