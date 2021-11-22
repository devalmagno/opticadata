import { Dispatch, ReactPropTypes, SetStateAction } from "react";
import styles from "./styles.module.scss";

import { OrderInfo } from "../../pages/orders";

type Props = {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    currentOrder: OrderInfo;
};

const OrderModal = ({ showModal, setShowModal, currentOrder }: Props) => {
    return (
        <>
            {showModal && (
            <div className={styles.bg_modal}>
                <div className={styles.modal_content}>
                    <div className={styles.header}>
                        <h3>Informações sobre a venda</h3>
                        <div 
                            className={styles.box_close}
                            onClick={() => { setShowModal(!showModal )}}    
                        >
                            <div className={styles.close}></div>
                            <div className={styles.close}></div>
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.infoTables}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Modelo</th>
                                        <th>Quantidade</th>
                                        <th>Preço</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrder.products.map(product => (
                                        <tr>
                                            <td></td>
                                            <td>{product.quantity}</td>
                                            <td></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Funcionário</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div className={styles.info}></div>
                    </div>
                </div>
                </div>
        )}
        </>
    );
};

export default OrderModal;
