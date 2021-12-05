import { Dispatch, SetStateAction, useRef, useState } from "react";

import { Product } from "../OrderSidebar";

import styles from "./styles.module.scss";

type Props = {
    products: Product[];
    orderProducts: Product[];
    setOrderProducts: Dispatch<SetStateAction<Product[]>>;
}

const ProductOrder = ({ products, orderProducts, setOrderProducts }: Props) => {
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

    const handleOrderProducts = (product: Product) => {
        let products = [...orderProducts];

        if (amount > 0 && !products.find((prod) => prod.id == product.id)) {
            products.push({
                id: product.id,
                name: product.name,
                quantity: amount,
                unit_price: product.unit_price,
            });
        } else {
            alert("Produto já adicionado ou quantidade insuficiente.")
        }

        setOrderProducts(products);
        setSearchValue("");
        setAmount(0);
        setCurrentProduct(undefined);
    };

    const removeProductFromOrder = (product: Product) => {
        let products = [...orderProducts];

        const index = products.indexOf(product);

        products.splice(index, 1);

        setOrderProducts(products);
    }
    
    return (
        <div
            className={
                currentProduct
                    ? `${styles.product} ${styles.active}`
                    : styles.product
            }
        >
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
                <div className={`${styles.box} ${styles.stock}`}>
                    <strong>Estoque</strong>
                    {currentProduct != null && currentProduct.quantity > 0 ? (
                        <span className={styles.available}>Disponível</span>
                    ) : (
                        <span className={styles.notAvailable}>Em falta</span>
                    )}
                </div>

                <div className={`${styles.box} ${styles.amount}`}>
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

            <div
                className={
                    currentProduct != null && currentProduct.quantity > 0
                        ? styles.button
                        : `${styles.button} ${styles.disabled}`
                }
            >
                <button
                    onClick={() => {
                        currentProduct != null
                            ? handleOrderProducts(currentProduct)
                            : undefined;
                    }}
                >
                    Adicionar produto
                </button>
            </div>

            <div className={styles.orderProducts}>
                {orderProducts.map((prod) => (
                    <div
                        key={prod.id}
                        className={styles.boxProd}
                        onClick={() => {
                            removeProductFromOrder(prod);
                        }}
                    >
                        <span>{prod.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductOrder;
