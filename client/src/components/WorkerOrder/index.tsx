import { Dispatch, SetStateAction, useRef, useState } from "react";

import { Worker } from "../OrderSidebar";

import styles from "./styles.module.scss";

type Props = {
    workers: Worker[];
    orderWorkers: Worker[];
    setOrderWorkers: Dispatch<SetStateAction<Worker[]>>;
};

const WorkerOrder = ({ orderWorkers, setOrderWorkers, workers }: Props) => {
    const [isSelected, setIsSelected] = useState(false);
    const [currentWorker, setCurrentWorker] = useState<Worker>();
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

    const handleWorkers = (product: Worker) => {
        setCurrentWorker(product);
        setIsSelected(!isSelected);
        setSearchValue("");
    };

    const handleOrderWorker = (worker: Worker) => {
        let workers = [...orderWorkers];

        if (!workers.find((w) => w.id == worker.id)) workers.push(worker);
        else alert("Funcionário já adicionado ou quantidade insuficiente.");

        setOrderWorkers(workers);
        setSearchValue("");
        setCurrentWorker(undefined);
    };

    const removeWorkerFromOrder = (worker: Worker) => {
        let workers = [...orderWorkers];

        const index = workers.indexOf(worker);

        workers.splice(index, 1);

        setOrderWorkers(workers);
    };

    return (
        <div
            className={
                currentWorker
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
                    {workers.map((worker) => (
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
                    {currentWorker
                        ? currentWorker.name
                        : "Selecione um funcionário"}

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

            <div className={styles.button}>
                <button
                    onClick={() => {
                        currentWorker != null
                            ? handleOrderWorker(currentWorker)
                            : undefined;
                    }}
                >
                    Adicionar funcionário
                </button>
            </div>

            <div className={styles.orderProducts}>
                {orderWorkers.map((worker) => (
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
