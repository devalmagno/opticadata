import {
    Dispatch,
    FormEvent,
    SetStateAction,
    useRef,
    useState,
    KeyboardEvent,
} from "react";
import { BiCheckCircle } from "react-icons/bi";

import { api } from "../../services/api";

import { Manager } from "../../pages/users";

import styles from "./styles.module.scss";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    managers: Manager[];
};

export type Occupation = {
    id: string;
    name: string;
};

const ManagerForm = ({ showModal, setShowModal, managers }: Props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const cpfRef = useRef<HTMLInputElement>(null);

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

        if (password && password !== confirmPassword) {
            alert("As senhas não correspondem.");
            return;
        } 

        console.log(name, email, cpf, phone, password);

        api.post(`/managers/register`, {
            name,
            email,
            cpf,
            phone,
            password: "admin"
        })
            .then(res => {
                managers.push(res.data.manager);
                setShowModal(!showModal);
            })
            .catch((err) => {
                console.log(err.message);
                alert("CPF ou E-mail já cadastrado.");
            });
    };

    return (
        <>
            {showModal ? (
                <div className={styles.bg_modal}>
                    <div className={styles.modal_content}>
                        <div className={styles.header}>
                            <h3>Adicionar gerente</h3>
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
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    className={styles.password}
                                    id="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="password"
                                    className={styles.password}
                                    placeholder="Confirmar senha"
                                    id="confirmPass"
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                                <div className={styles.bottom}></div>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="submit"
                                    value="Cadastrar funcionário"
                                    className={styles.submit}
                                />
                            </div>
                        </form>
                        <span>*A senha padrão para gerentes é "admin".</span>
                    </div>
                </div>
            ) : undefined}
        </>
    );
};

export default ManagerForm;
