import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";

import styles from "./styles.module.scss";

type Props = {
    title: string;
}

type Installments = {
    id: string;
    payment_id: string;
    price: string;
    payment_date: Date;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

export default function Header({ title }: Props) {
    const [installments, setInstallments] = useState([]);
    const [openBox, setOpenBox] = useState(false);

    useEffect(() => {
        api.get(`/installments/${currentDate()}`)
            .then(response => {
                setInstallments(response.data);
            })
    }, []);

    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            <div 
                className={
                    installments[0] ? 
                    `${styles.notification} ${styles.active}` 
                    : styles.notification 
                }
                onClick={() => { setOpenBox(!openBox) }}
            >
                <FaBell className={installments[0] ? `${styles.cursorActive} ${styles.icon}` : styles.icon} />
            </div>
            <div className={openBox ? `${styles.box} ${styles.open}` : styles.box }>
                    <h4>Notificações</h4>
                    {
                        installments.map(() => ( 
                            <div className={styles.content}>
                                <span>pagamento pendente marcado para hoje</span>
                            </div>
                        ))
                    }
            </div>
        </div>
    );
}

const currentDate = () => {
    const currentDate = {
        date: new Date().getDate(),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    }

    const payment_date = new Date(currentDate.year, currentDate.month, currentDate.date).toISOString();

    return payment_date;
}