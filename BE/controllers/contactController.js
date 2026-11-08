const ContactMessage = require('../models/ContactMessage');

// @desc    Send a contact message
// @route   POST /api/contact
// @access  Public
const sendContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập họ tên của bạn' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Vui lòng nhập địa chỉ email hợp lệ' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ message: 'Nội dung tin nhắn phải có ít nhất 10 ký tự' });
    }

    const contactMessage = await ContactMessage.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      id: contactMessage._id,
    });
  } catch (error) {
    console.error('sendContactMessage error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('getContactMessages error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { sendContactMessage, getContactMessages };
