import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import Loading from "../Loading";
import ProductOrder from "../ProductOrder";
import WorkerOrder from "../WorkerOrder";
import CustomerOrder from "../CustomerOrder";

import { useFetch } from "../../hooks/useFetch";

import styles from "./styles.module.scss";
import PaymentOrder from "../PaymentOrder";
import { api } from "../../services/api";

export type Product = {
    id: string;
    name: string;
    unit_price: number;
    quantity: number;
};

export type Worker = {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    occupation: {
        id: string;
        name: string;
    };
    sales: number;
};

export type Customer = {
    id: string;
    cpf: string;
    cnpj: string;
    name: string;
    email: string;
    phone: string;
};

export type Payment = {
    type_of_payment: string;
    payment_date: Date[];
};

const OrderSidebar = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const [orderProducts, setOrderProducts] = useState<Product[]>([]);
    const [orderWorkers, setOrderWorkers] = useState<Worker[]>([]);
    const [orderCustomers, setOrderCustomers] = useState<Customer[]>([]);
    const [orderPayment, setOrderPayment] = useState<Payment>({
        type_of_payment: "Dinheiro",
        payment_date: [],
    });

    const { data: products } = useFetch<Product[]>("/products");
    const { data: workers } = useFetch<Worker[]>("/workers");
    const { data: customers } = useFetch<Customer[]>("/customers");

    if (!products || !workers || !customers) return <Loading />;

    const handleCreateNewOrder = () => {
        const products_id = orderProducts.map(prod => prod.id);
        const workers_id = orderWorkers.map(worker => worker.id);
        const customer_id = orderCustomers[0] != null ? orderCustomers[0].id : null;
        const payment_date = formatedDate(orderPayment.payment_date);
        const quantity = orderProducts.map(prod => prod.quantity);
        let price = 0;

        orderProducts.forEach(prod => {
            price += prod.unit_price * prod.quantity;
        });


        api.post("/orders", {
            products_id,
            workers_id,
            customer_id,
            payment_date,
            price,
            quantity,
            type_of_payment: orderPayment.type_of_payment
        }).then(() => {
            alert("Registro de ordem feito com sucesso");
        }).catch(err => {
            console.log(err.message);
        })

        setOrderProducts([]);
        setOrderWorkers([]);
        setOrderCustomers([]);
        setOrderPayment({
            type_of_payment: "Dinheiro",
            payment_date: [],
        });
        setShowSidebar(!showSidebar);
    }

    return (
        <>
            {showSidebar ? (
                <div
                    className={
                        showSidebar
                            ? styles.sidebar
                            : `${styles.sidebar} ${styles.disabled}`
                    }
                >
                    <header>
                        <h3>Registrar venda</h3>

                        <div
                            onClick={() => {
                                setShowSidebar(!showSidebar);
                            }}
                            className={styles.icon}
                        >
                            <MdAddShoppingCart />
                        </div>
                    </header>

                    <div className={styles.container}>
                        <ProductOrder
                            products={products}
                            orderProducts={orderProducts}
                            setOrderProducts={setOrderProducts}
                        />

                        <WorkerOrder
                            workers={workers}
                            orderWorkers={orderWorkers}
                            setOrderWorkers={setOrderWorkers}
                        />

                        <CustomerOrder
                            customers={customers}
                            orderCustomers={orderCustomers}
                            setOrderCustomers={setOrderCustomers}
                        />

                        <PaymentOrder
                            orderPayment={orderPayment}
                            setOrderPayment={setOrderPayment}
                            customer={orderCustomers}
                        />

                        <div className={
                            orderProducts.length != 0 &&
                            orderWorkers.length != 0 &&
                            orderPayment.payment_date.length != 0 ?
                            styles.button :
                            `${styles.button} ${styles.disabled}`
                        }
                            onClick={handleCreateNewOrder}
                        >
                            <button>
                                Confirmar venda
                            </button>
                        </div>

                    </div>
                </div>
            ) : (
                <div
                    onClick={() => {
                        setShowSidebar(!showSidebar);
                    }}
                    className={
                        !showSidebar
                            ? styles.opensidebar
                            : `${styles.opensidebar} ${styles.active}`
                    }
                >
                    <MdAddShoppingCart />
                </div>
            )}
        </>
    );
};

const formatedDate = (dateList: Date[]) => {
    const currentDate = dateList.map(date => {
        return {
            date: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
        }
    })

    const payment_date = currentDate.map(date => {
        const formatedDate = new Date(date.year, date.month, date.date + 1).toISOString();

        return formatedDate;
    });
    
    return payment_date;
}

export default OrderSidebar;
