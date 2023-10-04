import React from "react";
import './Navbar.css';
function Navbar({ isAuthenticated ,onLogout }) {
    return (
        <div className="navbar-container">
            <div className="logo-container">
                <img className="logo" src="/logo_warranty_hound.png" alt="logo" />
            </div>

            {isAuthenticated ?
                <button onClick={onLogout}>Logout</button> : <div/>
            }

        </div>
    );
}

export default Navbar;