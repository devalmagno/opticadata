import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { api } from "../services/api";

import styles from "./login.module.scss";

const Home = () => {
    const cpfRef = useRef<HTMLInputElement>(null);

    const [isManager, setIsManager] = useState(false);
    const [isCapsLockOn, setIsCapslockOn] = useState(false);
    const [isWord, setIsWord] = useState(false);
    const [isError, setIsError] = useState(false);

    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [acessToken, setAcessToken] = useState('');

    const handleManager = () => {
      setIsManager(!isManager);
    }

    const handleCPFInput = (keyEvent: KeyboardEvent) => {
        if (keyEvent.key != 'Backspace' && keyEvent.key != 'Tab' && keyEvent.key != 'Enter') {
            if (!/\d/.test(keyEvent.key)) {
                setIsWord(true);
                return;
            } 
    
            setIsWord(false);


            if (cpfRef.current?.value.length == 3 || cpfRef.current?.value.length == 7) {
                cpfRef.current.value += ".";
            }
    
            if (cpfRef.current?.value.length == 11) {
                cpfRef.current.value += "-";
            }   
        }
    }

    const handleCapslock = (keyEvent: KeyboardEvent) => {
        if (keyEvent.getModifierState("CapsLock")) setIsCapslockOn(true);
        else setIsCapslockOn(false);
    }

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();

        api.post('managers/login', {
            cpf,
            password
        }).then(response => {
            alert('Login realizado com sucesso!');

            const { acessToken } = response.data;

            setAcessToken( acessToken ); 
        }).catch(() => {
            setIsError(true)
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="/logoopticodata.svg" alt="OpticoData" />
            </div>

            <div className={styles.login}>
                <h2>Bem vindo ao ÓpticoData</h2>
                <div className={styles.user}>
                    { isManager ? <h3>Gerente</h3> : <h3>Funcionario</h3> }

                    Mudar para {' '}
                    <strong onClick={handleManager}>
                      { isManager ? 'Funcionário' : 'Gerente' }
                    </strong>
                </div>
                <form onSubmit={handleLogin}>
                        <div className={`${styles.inputBox} ${styles.cpf}`}>
                            <input
                                ref={cpfRef}
                                
                                type="text"
                                name="cpf"
                                id="cpf"
                                placeholder="CPF"
                                pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                                autoComplete="off"
                                maxLength={14}
                                onKeyDown={keyEvent => handleCPFInput(keyEvent)}
                                value={cpf}
                                onChange={e => { setCpf(e.target.value) }}
                                required
                            />

                            {
                                isWord &&
                                (
                                    <div className={`${styles.warning} ${styles.isword}`}>
                                        <strong>Apenas números são permitidos.</strong>
                                    </div>  
                                )
                            }
                        </div>
                        <div className={styles.inputBox}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Senha"
                                onKeyDown={keyEvent => handleCapslock(keyEvent)}
                                value={password}
                                onChange={e => { setPassword(e.target.value) }}
                                required
                            />
                            { 
                                isCapsLockOn &&
                                (
                                    <div className={`${styles.warning} ${styles.capslock}`}>
                                        <strong>CapsLock ativado</strong>
                                    </div>      
                                )
                            }

{
                                isError &&
                                (
                                    <div className={`${styles.warning} ${styles.isword}`}>
                                        <strong>CPF ou senha errado.</strong>
                                    </div>
                                )
                            }
                        </div>

                        <div className={`${styles.inputBox} ${styles.button}`}>
                            <input type="submit" value="Entrar" />
                        </div>
                    </form>
            </div>

            <div className={styles.footer}>
                Desenvolvido por
                <img src="/logonorteminas.svg" alt="Norte Minas Soluções Digitais" />
            </div>
        </div>
    );
};

export default Home;
