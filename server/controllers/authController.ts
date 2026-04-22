import jwt from 'jsonwebtoken';
import User from '../models/User.js';

interface AuthData {
  username?: string;
  email?: string;
  password: string;
}

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

/**
 * Register a new user
 */
export const register = async (data: AuthData) => {
  const { username, email, password } = data;

  // Validation
  if (!username || !email || !password) {
    throw new Error('Please provide username, email and password');
  }

  // Check if user exists
  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (userExists) {
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  if (!user) {
    throw new Error('Invalid user data');
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  };
};

/**
 * Authenticate a user and get token
 */
export const login = async (data: AuthData) => {
  const { email, password } = data;

  // Validation
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  };
};