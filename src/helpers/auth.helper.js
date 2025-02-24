const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");

// ENV Vars
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7d";

/**
 * Registers a new user in the database.
 * @param {Object} userData - The user data (email, password, firstName, lastName, roles, phone).
 * @returns {Object} - Returns the created user object without the password.
 * @throws {Error} - Throws error if registration fails.
 */
const registerUser = async (userData) => {
    const { email, password, firstName, lastName, roles, phone } = userData;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Utente già esistente con questa email");
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new User
    const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        roles: roles || "user",
    });
    // Save user to database
    const createdUser = await newUser.save();
    // Convert to object and remove password field
    const userResponse = createdUser.toObject();
    delete userResponse.password;
    return userResponse;
};

/**
 * Authenticates a user and generates a JWT token.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Object} - Returns a JWT token and user data without password.
 * @throws {Error} - Throws error if login fails.
 */
const loginUser = async (email, password) => {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Utente non trovato con questa email");
    }
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Password errata");
    }
    // Generate JWT token
    const tokenPayload = {
        id: user.id,
        email: user.email,
        roles: user.roles,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
    });
    // Convert to object and remove password field
    const userResponse = user.toObject();
    delete userResponse.password;
    return { token, user: userResponse };
};

/**
 * Retrieves user data based on the provided user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Object} - Returns the user object without password.
 * @throws {Error} - Throws error if user is not found.
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("Utente non trovato");
    }
    return user;
};

module.exports = { registerUser, loginUser, getUserById };