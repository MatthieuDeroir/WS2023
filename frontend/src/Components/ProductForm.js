import React, { useState } from 'react';
import './ProductForm.css';
const { IP, PORT } = require('../config.js');

function ProductForm({ onProductAdded }) {
    const [manufacturer, setManufacturer] = useState('HP');
    const [serialNumbers, setSerialNumbers] = useState(['']);  // Initial state with one empty input
    const [csvFile, setCsvFile] = useState(null);
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [isAdding, setIsAdding] = useState(false);
    const [productsAdded, setProductsAdded] = useState(0);


    const handleAddProduct = async () => {
        setIsAdding(true);
        setProductsAdded(0);
        let errors = 0;
        try {
            setUser(localStorage.getItem('user'));

            for (const [index, sn] of serialNumbers.entries()) {
                const response = await fetch(`${IP}${PORT}/api/product`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({ serialNumber: sn, manufacturer, user })
                });

                if (response.ok) {
                    // Increment productsAdded by 1
                    setProductsAdded(prevCount => prevCount + 1);
                } else {
                    const data = await response.json();
                    console.error(data.message);
                    errors++;
                }

            }

            onProductAdded();
        } catch (error) {
            console.error("Error adding product:", error);
            errors++;
        } finally {
            setIsAdding(false);  // Remove the overlay after all products are added

            if (errors) {
                alert(`Finished adding products. There were ${errors} errors.`);
            } else {
                alert("All products were successfully added!");
            }
        }
    };

    const handleCSVUpload = async () => {
        // Assuming the CSV has two columns: MANUFACTURER,SERIALNUMBER
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = () => {
            const rows = reader.result.split('\n');
            const serials = rows.map(row => row.split(',')[1]);
            setSerialNumbers(serials);
        };
    };

    const handleInputChange = (index, value) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = value;
        setSerialNumbers(newSerialNumbers);
    };

    return (
        <div className="product-form-container">
            {isAdding && (
                <div className="overlay">
                    <div className="loading-icon"></div>
                    <p>{productsAdded} of {serialNumbers.length} products added</p>
                </div>
            )}
            <h2>Add Product</h2>
            <button onClick={() => setSerialNumbers([...serialNumbers, ''])}>+</button>
            <button onClick={() => setSerialNumbers(serialNumbers.slice(0, -1))}>-</button>
            <select value={manufacturer} onChange={(e) => setManufacturer(e.target.value)}>
                <option>HP</option>
                <option>LENOVO</option>
                <option>ASUS</option>
                <option>LG</option>
                <option>TOSHIBA</option>
                <option>SONY</option>
            </select>
            <button onClick={handleAddProduct}>Add Products</button>
            {serialNumbers.map((sn, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={sn}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder="Serial Number"
                    />
                </div>
            ))}

            <h3>Or upload a CSV</h3>
            <input type="file" onChange={(e) => setCsvFile(e.target.files[0])} />
            <button onClick={handleCSVUpload}>Upload and Parse CSV</button>
        </div>
    );
}

export default ProductForm;
