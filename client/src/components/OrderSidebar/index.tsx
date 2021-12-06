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
    unit_price: string;
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
        payment_date: [new Date()],
    });

    const { data: products } = useFetch<Product[]>("/products");
    const { data: workers } = useFetch<Worker[]>("/workers");
    const { data: customers } = useFetch<Customer[]>("/customers");

    if (!products || !workers || !customers) return <Loading />;

    const handleCreateNewOrder = () => {
        const products_id = orderProducts.map(prod => prod.id);

        api.post("/orders", {
        })
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
                            orderWorkers.length != 0 ? 
                            styles.button :
                            `${styles.button} ${styles.disabled}`
                        }>
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

export default OrderSidebar;
