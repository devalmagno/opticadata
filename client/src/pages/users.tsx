import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

import Header from "../components/Header";
import RemoveUserModal from "../components/RemoveUserModal";
import WorkerForm from "../components/WorkerForm";

import { useFetch } from "../hooks/useFetch";

import styles from "../styles/users.module.scss";
import { useState } from "react";

type Manager = {
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
    const [showCreateWorkerModal, setShowCreateWorkerModal] = useState(false);
    const [showRemoveUserModal, setShowRemoveUserModal] = useState(false);
    const [currentWorker, setCurrentWorker] = useState<Worker>();

    const { data: managers } = useFetch<Manager[]>("/managers");
    const { data: workers } = useFetch<Worker[]>("/workers");
    if (!managers || !workers) return <h2>Loading...</h2>;


    const handleRemoveUser = (worker: Worker) => {
        setCurrentWorker(worker);
        setShowRemoveUserModal(!showRemoveUserModal);
    }

    return (
        <div className={styles.container}>
            <Header title="Usuários" />
            <div className={styles.users}>
                <section className={styles.workers}>
                    <h3>Funcionários</h3>

                    <div className={styles.button}>
                        <button
                            onClick={() => {
                                setShowCreateWorkerModal(!showCreateWorkerModal)
                            }}
                        >Adicionar funcionário</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>Vendas</th>
                                <th>Cargo</th>
                                <th>Remover</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((worker) => (
                                <tr key={worker.id}>
                                    <td>{worker.name}</td>
                                    <td>
                                        {worker.email}
                                        <div className={styles.tooltip}>
                                            <span>{worker.email}</span>
                                        </div>
                                    </td>
                                    <td>{worker.cpf}</td>
                                    <td>{worker.phone}</td>
                                    <td>{worker.sales}</td>
                                    <td>{worker.occupation?.name}</td>
                                    <td>
                                        <div 
                                            className={styles.box_close}
                                            onClick={() => {
                                                handleRemoveUser(worker)
                                            }}
                                        >
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
                        <button>Adicionar gerente</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managers.map((manager) => (
                                <tr key={manager.id}>
                                    <td>{manager.name}</td>
                                    <td>{manager.email}</td>
                                    <td>{manager.cpf}</td>
                                    <td>{manager.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {showRemoveUserModal ? 
                <RemoveUserModal 
                    showModal={showRemoveUserModal} 
                    setShowModal={setShowRemoveUserModal}
                    worker={currentWorker!}
                /> :
                ''
            }

            {showCreateWorkerModal ? 
                <WorkerForm 
                    showModal={showCreateWorkerModal}
                    setShowModal={setShowCreateWorkerModal}
                /> : undefined
            }
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
