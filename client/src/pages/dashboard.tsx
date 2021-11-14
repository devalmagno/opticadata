import { GetServerSideProps } from "next";
import { useContext } from "react";
import { parseCookies } from "nookies";

import { AuthContext } from "../contexts/AuthContext";
import { useFetch } from "../hooks/useFetch";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const { data } = useFetch('/managers'); 

    console.log(data);
    
    return (
        <h1>{user?.name}</h1>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { 'opdauth.token': token } = parseCookies(ctx);
    
    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {

        }
    }
}

export default Dashboard;