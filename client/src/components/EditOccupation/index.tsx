import { Dispatch, FormEvent, SetStateAction, useState } from "react";

import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";

import OccupationModal from "../../components/OccupationModal";

import { Worker } from "../../pages/users";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    worker: Worker;
};

export type Occupation = {
    id: string;
    name: string;
};

const EditOccupation = ({
    showModal,
    setShowModal,
    worker
}: Props) => {
    const [showOccupationModal, setShowOccupationModal] = useState(false);
    const [occupation, setOccupation] = useState("none");

    const { data: occupations } = useFetch<Occupation[]>("/occupations");
    if (!occupations) return <div></div>;

    const handleWorkerOccupation = (e: FormEvent) => {
        e.preventDefault();

        if (occupation == worker.occupation.id) {
            alert(`O funcionário ${worker.name} já possui esse cargo.`);
            return;
        }

        if (occupation == "none" || occupation == "Cargo") {
            alert("Você não selecionou nenhum cargo.");
            return;
        }

        api.put(`/workers/occupation/${worker.id}`, {
            occupation_id: occupation
        })
            .then((res) => {
                alert("Funcionário atualizado com sucesso!");
                setShowModal(!showModal);
            })
            .catch((err) => {
                alert("Ocorreu um erro.");
            });
    };

    return (
        <>
            {showModal ? (
                <div className={styles.bg_modal}>
                    <div className={styles.modal_content}>
                        <div className={styles.header}>
                            <h3>Editar cargo de funcionário</h3>
                            <div
                                className={styles.box_close}
                                onClick={() => {
                                    setShowModal(!showModal);
                                }}
                            >
                                <div className={styles.close}></div>
                                <div className={styles.close}></div>
                            </div>
                        </div>

                        <div className={styles.about}>
                            <div className={styles.info}>
                                <strong>Funcionário: </strong>
                                <span>{worker.name}</span>
                            </div>
                            <div className={styles.info}>
                                <strong>Cargo atual: </strong>
                                <span>{worker.occupation.name}</span>
                            </div>
                        </div>

                        <form onSubmit={handleWorkerOccupation}>
                            <div className={styles.inputBox}>
                                <select
                                    name="Cargo"
                                    id="cargo"
                                    onChange={(e) => {
                                        setOccupation(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="Cargo">Cargo</option>
                                    {occupations.map((occ) => (
                                        <option key={occ.id} value={occ.id}>
                                            {occ.name}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <button
                                    onClick={(e: FormEvent) => {
                                        e.preventDefault();

                                        setShowOccupationModal(
                                            !showOccupationModal
                                        );
                                    }}
                                >
                                    Adicionar novo cargo
                                </button>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="submit"
                                    value="Confirmar"
                                    className={styles.submit}
                                />
                            </div>
                            <div className={styles.inputBox}>
                                <button
                                    className={styles.cancel}
                                    onClick={() => {
                                        setShowModal(!showModal);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>

                    {showOccupationModal ? (
                        <OccupationModal
                            showModal={showOccupationModal}
                            setShowModal={setShowOccupationModal}
                            occupations={occupations}
                        />
                    ) : undefined}
                </div>
            ) : undefined}
        </>
    );
};

export default EditOccupation;
