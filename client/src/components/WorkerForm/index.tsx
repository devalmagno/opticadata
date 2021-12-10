import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useRef,
    useState,
    KeyboardEvent,
} from "react";
import { BiCheckCircle } from "react-icons/bi";


import { useFetch } from "../../hooks/useFetch";
import { api } from "../../services/api";

import OccupationModal from "../../components/OccupationModal";

import { Worker } from "../../pages/users";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    workers: Worker[];
};

export type Occupation = {
    id: string;
    name: string;
};

const WorkerForm = ({ showModal, setShowModal, workers }: Props) => {
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

        api.post(`/workers/register`, {
            name,
            email,
            cpf,
            phone,
            occupation_id: occupation == "none" ? null : occupation,
        })
            .then(res => {
                const worker: Worker = res.data.worker;

                workers.push(worker);
                setShowModal(!showModal);
            }).catch(err => {
                alert(err.message);
            })
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
                                    id="name"
                                    maxLength={40}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    required
                                />
                                <label htmlFor="name">
                                    <BiCheckCircle className={styles.icon} />
                                </label>
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    id="email"
                                    maxLength={100}

                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    required
                                />
                                <label htmlFor="email">
                                    <BiCheckCircle className={styles.icon} />
                                </label>
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    ref={cpfRef}
                                    type="text"
                                    placeholder="CPF"
                                    id="cpf"
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
                                <label htmlFor="cpf">
                                    <BiCheckCircle className={styles.icon} />
                                </label>
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="tel"
                                    placeholder="Telefone"
                                    id="phone"
                                    pattern="[0-9]+"
                                    autoComplete="off"
                                    maxLength={11}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                    required
                                />
                                <label htmlFor="phone">
                                    <BiCheckCircle className={styles.icon} />
                                </label>
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
