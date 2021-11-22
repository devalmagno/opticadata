import { useState } from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

import { BiInfoCircle } from "react-icons/bi";

import { useFetch } from "../hooks/useFetch";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import styles from "./orders.module.scss";
import OrderModal from "../components/OrderModal";

type Order = {
    id: string;
    payment_id: string;
    customer_id: string;
    created_at: Date;
    updated_at: Date;
};

type Payment = {
    id: string;
    type_of_payment: string;
    created_at: Date;
    updated_at: Date;
};

type Installment = {
    id: string;
    payment_date: Date;
    payment_id: string;
    price: number;
    status: boolean;
    created_at: Date;
    updated_at: Date;
};

type Customer = {
    cnpj: string;
    cpf: string;
    created_at: Date;
    email: string;
    id: string;
    name: string;
    phone: string;
    updated_at: Date;
};

type Products = {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    created_at: Date;
};

type Workers = {
    id: string;
    worker_id: string;
    created_at: string;
    order_id: string;
};

export type OrderInfo = {
    order: Order;
    payment: Payment;
    customer: Customer;
    fullPrice: number;
    installment: Installment[];
    products: Products[];
    workers: Workers[];
};

export default function Orders() {
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<OrderInfo>();

    const { data: orderInfo } = useFetch<OrderInfo[]>("/orders");

    if (!orderInfo) return <h1>Loading...</h1>;

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
                    {orderInfo.map((info) => {
                        return (
                            <tr key={info.order.id}>
                                <td>R$ {info.fullPrice.toFixed(2)}</td>
                                <td>{info.payment.type_of_payment}</td>
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
                                    {info.customer ? info.customer.name : " "}
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
            <OrderModal 
                showModal={showModal} 
                setShowModal={setShowModal}
                currentOrder={currentOrder!} 
            />
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
