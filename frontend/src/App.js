import React, {useState, useEffect, useCallback} from 'react';
import Auth from './Components/Auth';
import ProductForm from './Components/ProductForm';
import ProductList from './Components/ProductList';
import Navbar from './Components/Navbar';
import './App.css';
const {IP, PORT} = require('./config.js');

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const userId = localStorage.getItem('user');
            if (!userId) {
                throw new Error('User ID not found in local storage');
            }

            const response = await fetch(`${IP}${PORT}/api/products/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setProducts(data)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    useEffect(() => {
        if (isAuthenticated) {
            setTimeout(() => {
                fetchProducts();
            }, 1000);
        }
    }, [isAuthenticated, fetchProducts]);

    return (
        <div className="App">
            <Navbar onLogout={() => setIsAuthenticated(false)} isAuthenticated={isAuthenticated} />
            {!isAuthenticated ? (
                <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
            ) : (
                <>
                    <ProductForm onProductAdded={fetchProducts} />
                    <ProductList products={products} />

                </>
            )}
        </div>
    );
}

export default App;
