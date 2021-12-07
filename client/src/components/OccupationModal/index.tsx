import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { api } from "../../services/api";
import { Occupation } from "../WorkerForm";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    occupations: Occupation[];
};

const OccupationModal = ({ showModal, setShowModal, occupations }: Props) => {
    const [name, setName] = useState('');

    const handleCreateOccupation = (e: FormEvent) => {
        e.preventDefault();

        api.post('/occupations/register', {
            name
        }).then(res => {
            occupations.push({
                id: res.data.id,
                name: res.data.name
            });
            setShowModal(!showModal);
        }).catch(err => { console.log(err) })
    }

    return (
        <>
            {showModal ? (
                <div className={styles.bg_modal}>
                    <div className={styles.content}>
                        <h3>Adicionar novo cargo</h3>

                        <form onSubmit={handleCreateOccupation}>
                            <div className={styles.inputBox}>
                                <input
                                    type="text"
                                    placeholder="Nome do cargo"
                                    onChange={e => { setName(e.target.value) }}
                                    maxLength={20}
                                    required
                                />
                                <div className={styles.bottom}></div>
                            </div>

                            <div className={styles.inputBox}>
                                <input className={styles.submit} type="submit" value="Criar cargo" />
                            </div>
                            
                            <div className={styles.inputBox}>
                                <button
                                    onClick={() => { setShowModal(!showModal) }}
                                >Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : undefined}
        </>
    );
};

export default OccupationModal;
