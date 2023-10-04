import React from "react";
import './Navbar.css';
function Navbar({ onLogout }) {
    return (
        <div className="navbar-container">
            <img className="logo" src="/logo_warranty_hound.png" alt="logo" />
            {/*<button onClick={onLogout}>Logout</button>*/}
        </div>
    );
}

export default Navbar;