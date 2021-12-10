import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { BiEdit } from "react-icons/bi";

import Header from "../components/Header";
import RemoveWorkerModal from "../components/RemoveWorkerModal";
import RemoveManagerModal from "../components/RemoveManagerModal";
import WorkerForm from "../components/WorkerForm";
import ManagerForm from "../components/ManagerForm";
import EditOccupation from "../components/EditOccupation";
import Loading from "../components/Loading";

import { useFetch } from "../hooks/useFetch";

import styles from "../styles/users.module.scss";
import { useState } from "react";

export type Manager = {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
};

type Occupation = {
    id: string;
    name: string;
};

export type Worker = {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    occupation: Occupation;
    sales: number;
};

const Users = () => {
    const [showCreateManagerModal, setShowCreateManagerModal] = useState(false);
    const [showRemoveManagerModal, setShowRemoveManagerModal] = useState(false);
    const [currentManager, setCurrentManager] = useState<Manager>();

    const [showCreateWorkerModal, setShowCreateWorkerModal] = useState(false);
    const [showRemoveWorkerModal, setShowRemoveWorkerModal] = useState(false);
    const [currentWorker, setCurrentWorker] = useState<Worker>();

    const [currentIndex, setCurrentIndex] = useState(0);

    const [showEditOccupation, setShowEditOccupation] = useState(false);

    const { data: managers } = useFetch<Manager[]>("/managers");
    const { data: workers } = useFetch<Worker[]>("/workers");
    if (!managers || !workers) return <Loading />

    if (!showRemoveWorkerModal) document.body.style.overflow = "unset";
    if (!showCreateWorkerModal) document.body.style.overflow = "unset";
    if (!showCreateManagerModal) document.body.style.overflow = "unset";

    const handleRemoveWorker = (worker: Worker, index: number) => {
        setCurrentWorker(worker);
        setCurrentIndex(index);
        setShowRemoveWorkerModal(!showRemoveWorkerModal);
    };

    const handleRemoveManager = (manager: Manager, index: number) => {
        setCurrentManager(manager);
        setCurrentIndex(index);
        setShowRemoveManagerModal(!showRemoveManagerModal);
    };

    const handleEditOccupation = (worker: Worker) => {
        setCurrentWorker(worker);
        setShowEditOccupation(!showEditOccupation);
    };

    return (
        <div className={styles.container}>
            <Header title="Usuários" />
            <div className={styles.users}>
                <section className={styles.workers}>
                    <h3>Funcionários</h3>

                    <div className={styles.button}>
                        <button
                            onClick={() => {
                                setShowCreateWorkerModal(
                                    !showCreateWorkerModal
                                );
                            }}
                        >
                            Adicionar funcionário
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>Vendas</th>
                                <th>
                                    Cargo <BiEdit color="#110425" />
                                </th>
                                <th>Remover</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((worker, index) => (
                                <tr key={worker.id}>
                                    <td>{worker.name}</td>
                                    <td>
                                        <div className={styles.email}><span>{worker.email}</span></div>
                                        <div className={styles.tooltip}>
                                            <span>{worker.email}</span>
                                        </div>
                                    </td>
                                    <td>{worker.cpf}</td>
                                    <td>{worker.phone}</td>
                                    <td>{worker.sales}</td>
                                    <td
                                        onClick={() => {
                                            handleEditOccupation(worker);
                                        }}
                                    >
                                        {worker.occupation != null
                                            ? worker.occupation.name
                                            : "Adicionar cargo"}
                                        <div className={styles.tooltip}>
                                            <span>Editar</span>
                                        </div>
                                    </td>
                                    <td
                                        onClick={() => {
                                            handleRemoveWorker(worker, index);
                                        }}
                                    >
                                        <div className={styles.box_close}>
                                            <div className={styles.close}></div>
                                            <div className={styles.close}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className={styles.managers}>
                    <h3>Gerentes</h3>

                    <div className={styles.button}>
                        <button
                            onClick={() => {
                                setShowCreateManagerModal(
                                    !showCreateManagerModal
                                );
                            }}
                        >
                            Adicionar gerente
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>Remover</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managers.map((manager, index) => (
                                <tr key={manager.id}>
                                    <td>{manager.name}</td>
                                    <td>{manager.email}</td>
                                    <td>{manager.cpf}</td>
                                    <td>{manager.phone}</td>
                                    <td
                                        onClick={() => {
                                            handleRemoveManager(manager, index);
                                        }}
                                    >
                                        <div className={styles.box_close}>
                                            <div className={styles.close}></div>
                                            <div className={styles.close}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {showRemoveWorkerModal ? (
                <RemoveWorkerModal
                    showModal={showRemoveWorkerModal}
                    setShowModal={setShowRemoveWorkerModal}
                    worker={currentWorker!}
                    index={currentIndex}
                    workersArray={workers}
                />
            ) : (
                ""
            )}

            {showRemoveManagerModal ? (
                <RemoveManagerModal
                    showModal={showRemoveManagerModal}
                    setShowModal={setShowRemoveManagerModal}
                    manager={currentManager!}
                    index={currentIndex}
                    managersArray={managers}
                />
            ) : (
                ""
            )}

            {showCreateWorkerModal ? (
                <WorkerForm
                    showModal={showCreateWorkerModal}
                    setShowModal={setShowCreateWorkerModal}
                    workers={workers}
                />
            ) : undefined}

            {showCreateManagerModal ? (
                <ManagerForm
                    showModal={showCreateManagerModal}
                    setShowModal={setShowCreateManagerModal}
                    managers={managers}
                />
            ) : undefined}

            {showEditOccupation ? (
                <EditOccupation
                    showModal={showEditOccupation}
                    setShowModal={setShowEditOccupation}
                    worker={currentWorker!}
                />
            ) : undefined}
        </div>
    );
};

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

export default Users;
