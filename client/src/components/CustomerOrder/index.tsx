import { Dispatch, SetStateAction, useRef, useState } from "react";

import { Customer } from "../OrderSidebar";

import styles from "./styles.module.scss";

type Props = {
    customers: Customer[];
    orderCustomers: Customer[];
    setOrderCustomers: Dispatch<SetStateAction<Customer[]>>;
};

const WorkerOrder = ({ orderCustomers, setOrderCustomers, customers }: Props) => {
    const [isSelected, setIsSelected] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer>();
    const [searchValue, setSearchValue] = useState("");

    const optionsContainerRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLDivElement[]>([]);
    optionsListRef.current = [];

    const addToRefs = (element: HTMLDivElement) => {
        if (element && !optionsListRef.current.includes(element)) {
            optionsListRef.current.push(element);
        }
    };

    const filterList = (searchTerm: string) => {
        setSearchValue(searchTerm);

        searchTerm = searchTerm.toLowerCase();
        optionsListRef.current.forEach((option) => {
            let label =
                option.firstElementChild?.nextElementSibling?.textContent?.toLowerCase();

            if (label?.indexOf(searchTerm) != -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        });
    };

    const handleWorkers = (customer: Customer) => {
        setCurrentCustomer(customer);
        setIsSelected(!isSelected);
        setSearchValue("");
    };

    const handleOrderWorker = (worker: Customer) => {
        let customers = [worker];

        setOrderCustomers(customers);
        setSearchValue("");
        setCurrentCustomer(undefined);
    };

    const removeWorkerFromOrder = (worker: Customer) => {
        let customers = [...orderCustomers];

        const index = customers.indexOf(worker);

        customers.splice(index, 1);

        setOrderCustomers(customers);
    };

    return (
        <div
            className={
                currentCustomer
                    ? `${styles.product} ${styles.active}`
                    : styles.product
            }
        >
            <div className={styles.select_box}>
                <div
                    ref={optionsContainerRef}
                    className={
                        isSelected
                            ? `${styles.options_container} ${styles.active}`
                            : styles.options_container
                    }
                >
                    {customers.map((worker) => (
                        <div
                            ref={addToRefs}
                            className={styles.option}
                            key={worker.id}
                            onClick={() => {
                                handleWorkers(worker);
                            }}
                        >
                            <input
                                type="radio"
                                name="worker"
                                id="worker"
                                className={styles.radio}
                            />
                            <label htmlFor={`${worker.name}`}>
                                {worker.name} {worker.cpf}
                            </label>
                        </div>
                    ))}
                </div>

                <div
                    onClick={() => {
                        setIsSelected(!isSelected);
                    }}
                    className={styles.selected}
                >
                    {currentCustomer
                        ? currentCustomer.name
                        : "Selecione um cliente"}

                    <div className={styles.bottom}></div>
                </div>

                <div className={styles.search_box}>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => {
                            filterList(e.target.value);
                        }}
                        placeholder="Digite para pesquisar..."
                    />
                </div>
            </div>

            <div
                className={
                        styles.button
                }
            >
                <button
                    onClick={() => {
                        currentCustomer != null
                            ? handleOrderWorker(currentCustomer)
                            : undefined;
                    }}
                >
                    Adicionar cliente
                </button>
            </div>

            <div className={styles.orderProducts}>
                {orderCustomers.map((worker) => (
                    <div
                        key={worker.id}
                        className={styles.boxProd}
                        onClick={() => {
                            removeWorkerFromOrder(worker);
                        }}
                    >
                        <span>{worker.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkerOrder;
