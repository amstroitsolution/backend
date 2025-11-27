const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('LOGIN ATTEMPT:', { email }); 

    if (!email || !password) {
      console.log('LOGIN ERROR: missing email/password');
      return res.status(400).json({ message: 'email and password required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    console.log('DB ADMIN:', !!admin, admin ? { email: admin.email, pwdHash: String(admin.password).slice(0,10) + '...' } : null);

    if (!admin) {
      console.log('LOGIN FAIL: admin not found for', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await admin.comparePassword(password);
    console.log('PASSWORD MATCH:', ok);

    if (!ok) {
      console.log('LOGIN FAIL: wrong password for', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, name: admin.name }, JWT_SECRET, { expiresIn: '7d' });

    console.log('LOGIN SUCCESS:', email);
    res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
