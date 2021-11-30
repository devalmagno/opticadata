import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useRef,
    useState,
    KeyboardEvent,
} from "react";

import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";
import OccupationModal from "../OccupationModal";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
};

export type Occupation = {
    id: string;
    name: string;
};

const WorkerForm = ({ showModal, setShowModal }: Props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [occupation, setOccupation] = useState("none");
    const [showOccupationModal, setShowOccupationModal] = useState(false);

    const cpfRef = useRef<HTMLInputElement>(null);

    const { data: occupations } = useFetch<Occupation[]>('/occupations');
    if (!occupations) return <div></div>;
    
    const handleCPFInput = (keyEvent: KeyboardEvent) => {
        if (
            keyEvent.key != "Backspace" &&
            keyEvent.key != "Tab" &&
            keyEvent.key != "Enter"
        ) {
            if (!/\d/.test(keyEvent.key)) {
                return;
            }

            if (
                cpfRef.current?.value.length == 3 ||
                cpfRef.current?.value.length == 7
            ) {
                cpfRef.current.value += ".";
            }

            if (cpfRef.current?.value.length == 11) {
                cpfRef.current.value += "-";
            }
        }
    };

    const handleCreateWorker = (e: FormEvent) => {
        e.preventDefault();

        console.log(occupation);

        api.post(`/workers/register`, {
            name,
            email,
            cpf,
            phone,
            occupation_id: occupation == "none" ? null : occupation,
        })
            .then(() => {
                setShowModal(!showModal);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <>
            {showModal ? (
                <div className={styles.bg_modal}>
                    <div className={styles.modal_content}>
                        <div className={styles.header}>
                            <h3>Adicionar funcionário</h3>
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

                        <form onSubmit={handleCreateWorker}>
                            <div className={styles.inputBox}>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    required
                                />
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    required
                                />
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    ref={cpfRef}
                                    type="text"
                                    placeholder="CPF"
                                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                                    autoComplete="off"
                                    maxLength={14}
                                    onChange={(e) => {
                                        setCpf(e.target.value);
                                    }}
                                    onKeyDown={(keyEvent) =>
                                        handleCPFInput(keyEvent)
                                    }
                                    required
                                />
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="tel"
                                    placeholder="Telefone"
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                    required
                                />
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <select
                                    name="Cargo"
                                    id="cargo"
                                    onChange={(e) => {
                                        setOccupation(e.target.value);
                                    }}
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

                                        setShowOccupationModal(!showOccupationModal)
                                    }}
                                >Adicionar novo cargo</button>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="submit"
                                    value="Cadastrar funcionário"
                                    className={styles.submit}
                                />
                            </div>
                        </form>
                        <span>*A senha padrão para funcionários é admin.</span>
                    </div>

                    {showOccupationModal ?
                        <OccupationModal 
                            showModal={showOccupationModal}
                            setShowModal={setShowOccupationModal}
                            occupations={occupations}
                        /> : 
                        undefined
                    }
                </div>
            ) : undefined}
        </>
    );
};

export default WorkerForm;
