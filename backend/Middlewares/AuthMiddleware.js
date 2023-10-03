const jwt = require('jsonwebtoken');


exports.protect = async (req, res, next) => {
    let token;

    // Obtenir le token du header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided!' });
    }

    try {
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attacher l'utilisateur au req pour les middlewares suivants
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Token is invalid or expired!' });
    }
};
