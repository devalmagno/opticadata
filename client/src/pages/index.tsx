import { KeyboardEvent, useRef, useState } from "react";

import styles from "./login.module.scss";

const Home = () => {
    const cpfRef = useRef<HTMLInputElement>(null);

    const [isManager, setIsManager] = useState(false);
    const [isCapsLockOn, setIsCapslockOn] = useState(false);

    const handleManager = () => {
      setIsManager(!isManager);
    }

    const handleCPFInput = () => {
        if (cpfRef.current?.value.length == 3 || cpfRef.current?.value.length == 7) {
            cpfRef.current.value += ".";
        }

        if (cpfRef.current?.value.length == 11) {
            cpfRef.current.value += "-";
        }
    }

    const handleCapslock = (keyEvent: KeyboardEvent) => {
        if (keyEvent.getModifierState("CapsLock")) setIsCapslockOn(true);
        else setIsCapslockOn(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <h2>Bem vindo ao OpticoData</h2>
                <div className={styles.user}>
                    { isManager ? <h3>Gerente</h3> : <h3>Funcionario</h3> }

                    Mudar para {' '}
                    <strong onClick={handleManager}>
                      { isManager ? 'Funcionário' : 'Gerente' }
                    </strong>
                </div>
                <form action="#">
                        <div className={styles.inputBox}>
                            <input
                                ref={cpfRef}
                                type="text"
                                name="cpf"
                                id="cpf"
                                placeholder="CPF"
                                maxLength={14}
                                onKeyDown={handleCPFInput}
                                required
                            />
                        </div>
                        <div className={styles.inputBox}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Senha"
                                onKeyDown={keyEvent => handleCapslock(keyEvent)}
                                required
                            />
                            { 
                                isCapsLockOn &&
                                (
                                    <div className={styles.capslock}>
                                        <strong>CapsLock ativado</strong>
                                    </div>      
                                )
                            }
                        </div>

                        <div className={`${styles.inputBox} ${styles.button}`}>
                            <input type="submit" value="Entrar" />
                        </div>
                    </form>
            </div>
        </div>
    );
};

export default Home;
