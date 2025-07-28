import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authMiddleware from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, securityQuestion, securityAnswer } = req.body;
    if (!username || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);
    const user = new User({
      username,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, username: user.username, securityQuestion: user.securityQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Master password reset
router.post('/reset', async (req, res) => {
  try {
    const { username, securityAnswer, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    const isAnswerMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isAnswerMatch) return res.status(400).json({ message: 'Incorrect security answer.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Master password verification
router.post('/verify-master', authMiddleware, async (req: any, res) => {
  try {
    const { masterPassword } = req.body;
    if (!masterPassword) return res.status(400).json({ message: 'Master password required.' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ message: 'User not found.' });
    const isMatch = await bcrypt.compare(masterPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect master password.' });
    res.json({ message: 'Master password verified.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 