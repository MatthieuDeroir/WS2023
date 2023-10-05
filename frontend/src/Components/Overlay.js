import React from "react";

function Overlay({ children, onClose }) {
    return (
        <div className="overlay">
        <div className="overlay-content">
            <button className="start-button" onClick={onClose}>
            START
            </button>
            {children}
        </div>
        </div>
    );
}