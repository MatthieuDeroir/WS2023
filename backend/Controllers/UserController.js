const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(409).json({ message: 'Username is already taken' });
        }

        // Hash le mot de passe avant de le stocker
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crée un nouvel utilisateur et renvoie un token
        const user = await User.create({ username, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
