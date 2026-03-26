const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });
    res.status(201).json({ message: 'Đăng ký thành công', user: { email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Quên mật khẩu (gửi email reset)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    // Gửi email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `<p>Nhấn vào link để đặt lại mật khẩu: <a href="${resetLink}">${resetLink}</a></p>`
    });
    res.json({ message: 'Đã gửi email đặt lại mật khẩu' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Xem hồ sơ
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// Cập nhật hồ sơ
exports.updateProfile = async (req, res) => {
  const { name, avatar, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, avatar, phone }, { new: true }).select('-password');
  res.json(user);
};
