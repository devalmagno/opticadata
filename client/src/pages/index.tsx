import { useState } from "react";
import styles from "./login.module.scss";

const Home = () => {
    const [isManager, setIsManager] = useState(false);

    const handleManager = () => {
      setIsManager(!isManager);
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
                                type="text"
                                name="cpf"
                                id="cpf"
                                placeholder="CPF"
                                required
                            />
                        </div>
                        <div className={styles.inputBox}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Senha"
                                required
                            />
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
