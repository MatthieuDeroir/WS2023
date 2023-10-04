import React, { useState } from 'react';
import './ProductList.css';

function ProductList({ products, fetchProducts }) {
    const [searchTerm, setSearchTerm] = useState('');


    const handleDelete = async (serialNumber) => {
        try {
            const response = await fetch(`http://localhost:4000/api/product/${serialNumber}`, {
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
                {products.filter(product => product.serialNumber.includes(searchTerm)).map((product) => (
                <li key={product.serialNumber}>
                        {product.productName} - {product.serialNumber} - {product.warrantyExpirationDate}
                    {isUnderWarranty(product.warrantyExpirationDate) ?
                        <img src="/sg.png" className="warranty-icon" /> :
                        <img src="/hg.png" className="warranty-icon" />
                    }
                        <button onClick={() => handleDelete(product.serialNumber)}>Delete</button>
                    </li>
                ))}

            </ul>
        </div>
    );
}

export default ProductList;
