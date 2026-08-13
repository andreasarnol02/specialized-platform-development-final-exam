const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const { sendServerError, sendWriteError } = require("../utils/httpError");

const userData = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
// Registers a new user with role 'student', then logs them in (returns token).
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
        data: null,
      });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        token: generateToken(user._id, "student"),
        user: userData(user),
      },
    });
  } catch (error) {
    return sendWriteError(res, error);
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Email atau kata sandi salah",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token: generateToken(user._id, user.role),
        user: userData(user),
      },
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

// GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil berhasil dimuat",
      data: userData(user),
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
