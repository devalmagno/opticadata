import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

import Header from "../components/Header";

import { useFetch } from "../hooks/useFetch";

import styles from "../styles/users.module.scss";

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

type Worker = {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    occupation: Occupation;
    sales: number;
};

const Users = () => {
    const { data: managers } = useFetch<Manager[]>("/managers");
    const { data: workers } = useFetch<Worker[]>("/workers");

    if (!managers || !workers) return <h2>Loading...</h2>;

    return (
        <div className={styles.container}>
            <Header title="Usuários" />
            <div className={styles.users}>
                <section className={styles.workers}>
                    <h3>Funcionários</h3>

                    <div className={styles.button}>
                        <button>Adicionar funcionário</button>
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
