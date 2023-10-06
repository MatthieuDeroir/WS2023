import React, {useState, useEffect} from 'react';
import './ProductForm.css';


const {IP, PORT} = require('../config.js');

function ProductForm({onProductAdded}) {
    const [products, setProducts] = useState([{manufacturer: 'HP', serialNumber: ''}]);
    const [csvFile, setCsvFile] = useState(null);
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(false);
    const [productsAdded, setProductsAdded] = useState(0);
    const [validProducts, setValidProducts] = useState([]);


    useEffect(() => {
        if (isLoading && productsAdded === products.length) {
            setIsLoading(false);
            alert('Produits ajoutés avec succès!');
            onProductAdded();
        }
    }, [productsAdded]);

    const handleAddProduct = async () => {
        setIsLoading(true);
        setProductsAdded(0);
        try {
            setUser(localStorage.getItem('user'));

            const validProductList = products.filter(product => product.serialNumber.trim());
            setValidProducts(validProductList);

            for (const product of validProductList) {
                const response = await fetch(`${IP}${PORT}/api/product`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },

                    body: JSON.stringify({
                        serialNumber: product.serialNumber,
                        manufacturer: product.manufacturer,
                        user
                    })
                });
                setProductsAdded(prevCount => prevCount + 1); // increment for each product added

                const data = await response.json();
                if (data.error) {
                    console.error(data.message);
                }
            }

            onProductAdded();
            setIsLoading(false);

        } catch (error) {
            console.error("Erreur lors de l'ajout des produits:", error);
        }
    };

    const handleCSVUpload = async () => {
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = () => {
            const rows = reader.result.split('\n')
            const newProducts = rows.map(row => {
                const [manufacturer, serialNumber] = row.split(';');
                return {manufacturer, serialNumber};
            });

            const updatedProducts = products.map(product => {
                if (!product.serialNumber.trim() && newProducts.length) {
                    return newProducts.shift();
                }
                return product;
            });

            setProducts([...updatedProducts, ...newProducts]);
        };
    };


    const handleSerialNumberChange = (index, value) => {
        const updatedProducts = [...products];
        updatedProducts[index].serialNumber = value;
        setProducts(updatedProducts);
    };

    const handleManufacturerChange = (index, value) => {
        const updatedProducts = [...products];
        updatedProducts[index].manufacturer = value;
        setProducts(updatedProducts);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };
    return (
        <div className="product-form-container" style={{width: '70%', margin: 'auto'}}>
            {isLoading && (
                <>
                    <div className="loading-container">
                        <div className="loader"></div>
                        <img className="loader-icon" src="favicon.ico" ></img>

                        <span className="loading-text">Ajout de produits {productsAdded} sur {products.length}...</span>
                        <div style={{height: '10px', width: '40%', backgroundColor: '#e0e0e0', position: 'relative'}}>
                            <div style={{height: '100%', width: `${(productsAdded / validProducts.length) * 100}%`, backgroundColor: '#6200ea'}}></div>
                        </div>
                    </div>


                </>
            )}
            <h2>Ajouter des produits</h2>
            <div>
                <button onClick={() => setProducts([...products, {manufacturer: 'HP', serialNumber: ''}])}>+</button>
                <button onClick={() => setProducts(products.slice(0, -1))} style={{marginLeft: '10px'}}>-</button>
            </div>
            <br/>
            <div className="products-list-scrollable">
                {products.map((product, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <select
                            value={product.manufacturer}
                            onChange={(e) => handleManufacturerChange(index, e.target.value)}
                            style={{marginRight: '10px', flex: 1}}
                        >
                            <option>HP</option>
                            <option>LENOVO</option>
                            <option>ASUS</option>
                            <option>LG</option>
                            <option>TOSHIBA</option>
                            <option>SONY</option>
                        </select>
                        <input
                            type="text"
                            value={product.serialNumber}
                            onChange={(e) => handleSerialNumberChange(index, e.target.value)}
                            placeholder="Numéro de série"
                            style={{marginRight: '10px', flex: 2}}
                        />
                        <button onClick={() => handleRemoveProduct(index)}>X</button>
                    </div>
                ))}
            </div>

            <button onClick={handleAddProduct} style={{marginTop: '10px'}}>Ajouter des produits</button>

            <h3>Ou téléchargez un CSV</h3>
            <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} style={{marginBottom: '10px'}}/>
            <button onClick={handleCSVUpload}>Télécharger et analyser le CSV</button>
        </div>
    );
}

export default ProductForm;
