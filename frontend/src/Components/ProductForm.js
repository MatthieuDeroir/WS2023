import React, { useState } from 'react';
import './ProductForm.css';

function ProductForm({ onProductAdded }) {
    const [products, setProducts] = useState([{ manufacturer: 'HP', serialNumber: '' }]);
    const [csvFile, setCsvFile] = useState(null);
    const [user, setUser] = useState(localStorage.getItem('user'));

    const handleAddProduct = async () => {
        try {
            setUser(localStorage.getItem('user'));

            const validProducts = products.filter(product => product.serialNumber.trim());

            for (const product of validProducts) {
                const response = await fetch('http://localhost:4000/api/product', {
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

                const data = await response.json();
                if (data.error) {
                    console.error(data.message);
                }
            }

            onProductAdded();
            alert('Produits ajoutés avec succès!');

        } catch (error) {
            console.error("Erreur lors de l'ajout des produits:", error);
        }
    };

    const handleCSVUpload = async () => {
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = () => {
            const rows = reader.result.split('\n').slice(1);
            const newProducts = rows.map(row => {
                const [manufacturer, serialNumber] = row.split(',');
                return { manufacturer, serialNumber };
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
        <div className="product-form-container" style={{ width: '70%', margin: 'auto' }}>
            <h2>Ajouter des produits</h2>
            {products.map((product, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <select
                        value={product.manufacturer}
                        onChange={(e) => handleManufacturerChange(index, e.target.value)}
                        style={{ marginRight: '10px', flex: 1 }}
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
                        style={{ marginRight: '10px', flex: 2 }}
                    />
                    <button onClick={() => handleRemoveProduct(index)}>X</button>
                </div>
            ))}
            <div>
                <button onClick={() => setProducts([...products, { manufacturer: 'HP', serialNumber: '' }])}>+</button>
                <button onClick={() => setProducts(products.slice(0, -1))} style={{ marginLeft: '10px' }}>-</button>
            </div>
            <button onClick={handleAddProduct} style={{ marginTop: '10px' }}>Ajouter des produits</button>

            <h3>Ou téléchargez un CSV</h3>
            <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} style={{ marginBottom: '10px' }}/>
            <button onClick={handleCSVUpload}>Télécharger et analyser le CSV</button>
        </div>
    );
}

export default ProductForm;
