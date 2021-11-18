import Header from "../components/Header";
import { useFetch } from "../hooks/useFetch";

import { BiInfoCircle } from "react-icons/bi";

import styles from "./orders.module.scss";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

type Order = {
    id: string;
    payment_id: string;
    customer_id: string;
    created_at: Date;
    updated_at: Date;
}

type Payment = {
    id: string;
    type_of_payment: string;
    created_at: Date;
    updated_at: Date;
}

type Installment = {
    id: string;
    payment_date: Date;
    payment_id: string;
    price: number;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

export default function Orders() {
    const { data: orders } = useFetch<Order[]>('/orders');
    const { data: payments } = useFetch<Payment[]>('/payments');
    const { data: installments } = useFetch<Installment[]>('/installments');

    if (!orders || !payments || !installments) return (<h1>Loading...</h1>)

    const orderInfo = 
        orders?.map(order => {
            let fullPrice = 0;

            installments.map(installment => {
                if (installment.payment_id == order.payment_id)
                    fullPrice += installment.price;
            });

            return {
                order,
                payment: payments?.find(payment => payment.id == order.payment_id),
                fullPrice,
                installments: installments?.filter(installment => {
                    if (installment.payment_id == order.payment_id)
                        return installment;
                    else return;
                })
            }
        });

    return (
        <section>
            <Header title="Vendas" />

            <main className={styles.container}>
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
                        {
                            orderInfo?.map(info => (
                                <tr>
                                    <td>
                                       R$ {info.fullPrice}
                                    </td>
                                    <td>
                                        {info.payment?.type_of_payment}
                                    </td>
                                    <td>
                                        {info.installments.length > 1 ? 'parcelado' : 'à vista'}
                                    </td>
                                    <td>
                                        {info.installments[0].status ? 'Pago' : 'Pendente'}
                                    </td>
                                    <td></td>
                                    <td>
                                        <BiInfoCircle />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </main>
        </section>
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
