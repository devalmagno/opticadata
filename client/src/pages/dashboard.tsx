import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

import Header from "../components/Header";

import styles from "../styles/dashboard.module.scss";

const Dashboard = () => {
    return (
        <section className={styles.dashboard}>
            <Header title="Dashboard" />
        </section>
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

export default Dashboard;
