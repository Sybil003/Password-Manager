import express from 'express';
import Credential from '../models/Credential';
import authMiddleware from '../middleware/auth';
import { encrypt, decrypt } from '../utils/crypto';

const router = express.Router();

// Get all credentials for user
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const credentials = await Credential.find({ user: req.userId });
    const decrypted = credentials.map((cred) => ({
      ...cred.toObject(),
      password: decrypt(cred.password),
      mpin: cred.mpin ? decrypt(cred.mpin) : undefined,
      securityQuestions: cred.securityQuestions ? decrypt(cred.securityQuestions) : undefined,
      notes: cred.notes ? decrypt(cred.notes) : undefined,
    }));
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add credential
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { category, accountName, username, password, mpin, securityQuestions, notes } = req.body;
    const credential = new Credential({
      user: req.userId,
      category,
      accountName,
      username,
      password: encrypt(password),
      mpin: mpin ? encrypt(mpin) : undefined,
      securityQuestions: securityQuestions ? encrypt(securityQuestions) : undefined,
      notes: notes ? encrypt(notes) : undefined,
    });
    await credential.save();
    res.status(201).json({ message: 'Credential added.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update credential
router.put('/:id', authMiddleware, async (req: any, res) => {
  try {
    const { category, accountName, username, password, mpin, securityQuestions, notes } = req.body;
    const update: any = {
      category,
      accountName,
      username,
    };
    if (password) update.password = encrypt(password);
    if (mpin) update.mpin = encrypt(mpin);
    if (securityQuestions) update.securityQuestions = encrypt(securityQuestions);
    if (notes) update.notes = encrypt(notes);
    await Credential.findOneAndUpdate({ _id: req.params.id, user: req.userId }, update);
    res.json({ message: 'Credential updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete credential
router.delete('/:id', authMiddleware, async (req: any, res) => {
  try {
    await Credential.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Credential deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Search/filter credentials
router.get('/search', authMiddleware, async (req: any, res) => {
  try {
    const { category, keyword } = req.query;
    let query: any = { user: req.userId };
    if (category) query.category = category;
    if (keyword) query.$or = [
      { accountName: { $regex: keyword, $options: 'i' } },
      { username: { $regex: keyword, $options: 'i' } },
      { notes: { $regex: keyword, $options: 'i' } },
    ];
    const credentials = await Credential.find(query);
    const decrypted = credentials.map((cred) => ({
      ...cred.toObject(),
      password: decrypt(cred.password),
      mpin: cred.mpin ? decrypt(cred.mpin) : undefined,
      securityQuestions: cred.securityQuestions ? decrypt(cred.securityQuestions) : undefined,
      notes: cred.notes ? decrypt(cred.notes) : undefined,
    }));
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router; 