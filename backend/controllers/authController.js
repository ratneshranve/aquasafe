const User = require('../models/User');
const Engineer = require('../models/Engineer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user is admin
    if (email === 'admin@aquasafe.com' && password === 'admin123') {
      const token = generateToken('admin-id', 'Admin');
      return res.json({
        _id: 'admin-id',
        name: 'Admin',
        email,
        role: 'Admin',
        token,
      });
    }

    // Check if user
    let user = await User.findOne({ email });
    let role = 'User';
    
    // If not user, check if engineer
    if (!user) {
      user = await Engineer.findOne({ email });
      role = 'Engineer';
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        meterId: user.meterId,
        zone: user.zone,
        tank: user.tank,
        ward: user.ward,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
