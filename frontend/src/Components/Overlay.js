import React, {useState} from "react";
import "./Overlay.css";

function Overlay({ onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div className={`overlay ${isVisible ? '' : 'slide-out'}`}>
            <div className="overlay-content">
                <img src="/favicon.ico" alt="Logo" />
                <h2>🌟 Bienvenue sur WarrantyHound! 🌟</h2>
                <p>
                    Gérer les garanties de votre parc informatique n'a jamais été aussi simple. Dites adieu aux
                    démarches complexes et aux recherches sans fin. Avec WarrantyHound, bénéficiez d'une solution
                    centralisée, rapide et intuitive pour suivre et gérer toutes vos garanties de matériel
                    informatique. De la petite entreprise au grand parc informatique, nous avons une solution
                    adaptée à vos besoins. Connectez-vous et découvrez comment nous pouvons transformer votre
                    gestion des garanties!
                </p>
                <button className="start-button" onClick={() => setIsVisible(false)}>
                    START
                </button>
            </div>
        </div>
    );
}

export default Overlay;
