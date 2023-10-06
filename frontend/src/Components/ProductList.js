import React, { useState } from 'react';
import './ProductList.css';
const {IP, PORT} = require('../config.js');

function ProductList({ products, fetchProducts }) {
    const [searchTerm, setSearchTerm] = useState('');


    const handleDelete = async (serialNumber) => {
        try {
            const response = await fetch(`${IP}${PORT}/api/product/${serialNumber}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                // Refresh the product list after deletion
                fetchProducts();
            } else {
                const data = await response.json();
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const isUnderWarranty = (warrantyDate) => {
        if (!warrantyDate) return false; // Ajoutez cette ligne pour gérer les valeurs null ou non définies

        const [day, month, year] = warrantyDate.split('/');
        const warrantyEndDate = new Date(year, month - 1, day); // month is 0-indexed
        const currentDate = new Date();

        return currentDate <= warrantyEndDate;
    };

    return (
        <div className="product-list-container">
            <h2>Product List</h2>
            <input
                type="text"
                placeholder="Search by serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul>
                <li className="table-header">
                    <span>Name</span>
                    <span>Serial</span>
                    <span>Date</span>
                    <span>Actions</span>
                </li>
                {products.filter(product => product.serialNumber && product.serialNumber.includes(searchTerm)).map((product) => (
                    <li key={product.serialNumber || "Non renseignée"} className="product-item">
                        <span className="product-name">{product.productName || "Non renseignée"}</span>
                        <span className="product-serial">{product.serialNumber || "Non renseignée"}</span>
                        <span className="product-date">{product.warrantyExpirationDate || "Non renseignée"}</span>
                        <div className="product-actions">
                            {product.warrantyExpirationDate && isUnderWarranty(product.warrantyExpirationDate) ?
                                <img src="/sg.png" className="warranty-icon" /> :
                                <img src="/hg.png" className="warranty-icon" />
                            }
                            <button onClick={() => product.serialNumber && handleDelete(product.serialNumber)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList;
