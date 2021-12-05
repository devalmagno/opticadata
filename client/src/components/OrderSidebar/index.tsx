import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import Loading from "../Loading";

import { useFetch } from "../../hooks/useFetch";

import styles from "./styles.module.scss";

type Product = {
    id: string;
    name: string;
    unit_price: string;
    quantity: number;
};

const OrderSidebar = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product>();
    const [searchValue, setSearchValue] = useState("");
    const [amount, setAmount] = useState(0);

    if (amount < 0) {
        setAmount(0);
    }

    if (currentProduct && amount > currentProduct.quantity) {
        setAmount(currentProduct.quantity);
    }

    const optionsContainerRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLDivElement[]>([]);
    optionsListRef.current = [];

    const { data: products } = useFetch<Product[]>("/products");
    if (!products) return <Loading />;

    const addToRefs = (element: HTMLDivElement) => {
        if (element && !optionsListRef.current.includes(element)) {
            optionsListRef.current.push(element);
        }
    };

    const filterList = (searchTerm: string) => {
        setSearchValue(searchTerm);

        searchTerm = searchTerm.toLowerCase();
        optionsListRef.current.forEach((option) => {
            let label =
                option.firstElementChild?.nextElementSibling?.textContent?.toLowerCase();

            if (label?.indexOf(searchTerm) != -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        });
    };

    const handleProducts = (product: Product) => {
        setCurrentProduct(product);
        setIsSelected(!isSelected);
        setSearchValue("");
    };

    return (
        <>
            {showSidebar ? (
                <div className={styles.sidebar}>
                    <header>
                        <h3>Registrar venda</h3>

                        <div
                            onClick={() => {
                                setShowSidebar(!showSidebar);
                            }}
                            className={styles.icon}
                        >
                            <MdAddShoppingCart />
                        </div>
                    </header>

                    <div className={styles.container}>
                        <div className={styles.product}>
                            <div className={styles.select_box}>
                                <div
                                    ref={optionsContainerRef}
                                    className={
                                        isSelected
                                            ? `${styles.options_container} ${styles.active}`
                                            : styles.options_container
                                    }
                                >
                                    {products.map((product) => (
                                        <div
                                            ref={addToRefs}
                                            className={styles.option}
                                            key={product.id}
                                            onClick={() => {
                                                handleProducts(product);
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="product"
                                                id="product"
                                                className={styles.radio}
                                            />
                                            <label htmlFor={`${product.name}`}>
                                                {product.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div
                                    onClick={() => {
                                        setIsSelected(!isSelected);
                                    }}
                                    className={styles.selected}
                                >
                                    {currentProduct
                                        ? currentProduct.name
                                        : "Selecione um produto"}

                                    <div className={styles.bottom}></div>
                                </div>

                                <div className={styles.search_box}>
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => {
                                            filterList(e.target.value);
                                        }}
                                        placeholder="Digite para pesquisar..."
                                    />
                                </div>
                            </div>

                            <div
                                className={
                                    currentProduct
                                        ? `${styles.info} ${styles.active}`
                                        : styles.info
                                }
                            >
                                <div
                                    className={`${styles.box} ${styles.stock}`}
                                >
                                    <strong>Estoque</strong>
                                    {currentProduct != null &&
                                    currentProduct.quantity > 0 ? (
                                        <span className={styles.available}>
                                            Disponível
                                        </span>
                                    ) : (
                                        <span className={styles.notAvailable}>
                                            Em falta
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={`${styles.box} ${styles.amount}`}
                                >
                                    <strong>Quantidade</strong>
                                    <div
                                        className={
                                            currentProduct != null &&
                                            currentProduct?.quantity > 0
                                                ? styles.amountBox
                                                : `${styles.amountBox} ${styles.disabled}`
                                        }
                                    >
                                        <div
                                            onClick={() => {
                                                setAmount(amount - 1);
                                            }}
                                            className={`${styles.operator} ${styles.less}`}
                                        >
                                            -
                                        </div>
                                        <div className={styles.quantity}>
                                            {amount} /{currentProduct?.quantity}
                                        </div>
                                        <div
                                            onClick={() => {
                                                setAmount(amount + 1);
                                            }}
                                            className={`${styles.operator} ${styles.plus}`}
                                        >
                                            +
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={
                                currentProduct != null && currentProduct.quantity > 0 ? styles.button : `${styles.button} ${styles.disabled}`
                            }>
                                <button
                                    // onClick={() => {
                                        // setShowCreateManagerModal(
                                            // !showCreateManagerModal
                                        // );
                                    // }}
                                >
                                    Adicionar produto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => {
                        setShowSidebar(!showSidebar);
                    }}
                    className={
                        !showSidebar
                            ? styles.opensidebar
                            : `${styles.opensidebar} ${styles.active}`
                    }
                >
                    <MdAddShoppingCart />
                </div>
            )}
        </>
    );
};

export default OrderSidebar;
