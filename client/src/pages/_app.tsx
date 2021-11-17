import type { AppProps } from "next/app";
import { parseCookies } from "nookies";

import Sidebar from '../components/Sidebar';

import AuthProvider from "../contexts/AuthContext";

import "../styles/global.scss";
import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const { "opdauth.token": token } = parseCookies();

  return (
        <AuthProvider>
            {
                token ? (
                    <div className={styles.wrapper}>
                        <Sidebar />
                        <main>
                            <Component {...pageProps} />
                        </main>
                    </div>
                )
                :
                <Component {...pageProps} />
            }
        </AuthProvider>
    );
}

export default MyApp;
