import TicketType from '../models/TicketType.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const getTicketTypes = async (req, res, next) => {
  try {
    const ticketTypes = await TicketType.find();
    res.status(200).json({ success: true, data: ticketTypes });
  } catch (error) {
    next(error);
  }
};

export const addTicketType = async (req, res, next) => {
  try {
    const { name, price, description, discount, isActive, nameAr, descriptionAr } = req.body;
    const ticketType = await TicketType.create({ name, price, description, nameAr, descriptionAr, discount, isActive });
    res.status(201).json({ success: true, data: ticketType });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { ticketTypeId, targetDate, quantity, email } = req.body;

    // Validate date
    const dateObj = new Date(targetDate);
    if (isNaN(dateObj.getTime()) || dateObj < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ success: false, error: "Invalid or past target date." });
    }

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: "Quantity must be at least 1." });
    }

    // Fetch ticket type to calculate price securely
    const ticketType = await TicketType.findById(ticketTypeId);
    if (!ticketType) {
      return res.status(404).json({ success: false, error: "Ticket type not found." });
    }

    const totalPrice = ticketType.price * quantity;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const booking = await Booking.create({
      userId: user._id,
      ticketTypeId,
      targetDate: dateObj,
      totalPrice,
      quantity,
    });

    res.status(201).json({
      success: true,
      data: {
        bookingId: booking._id,
        qrCodeId: booking.qrCodeId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAndConfirmPayment = async (req, res, next) => {
  try {
    const { qrCodeId } = req.body;

    // Simulate Agent Role Check via middleware in production

    // 1. Find Booking
    const booking = await Booking.findOne({ qrCodeId }).populate('ticketType user');

    if (!booking) {
      return res.status(404).json({ success: false, error: "رمز غير صالح أو الحجز غير موجود" });
    }

    // 2. Check if already paid
    if (booking.status === "PAID") {
      return res.status(400).json({ success: false, error: "تم تأكيد هذه التذكرة مسبقاً" });
    }

    // 3. Check if target date is today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.targetDate);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate.getTime() !== today.getTime()) {
      return res.status(400).json({ success: false, error: "هذه التذكرة ليست صالحة لليوم" });
    }

    // 4. Update status to PAID
    booking.status = "PAID";
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        status: booking.status,
        customerName: booking.user.email,
        ticketName: booking.ticketType.name,
        quantity: booking.quantity,
        totalPrice: booking.totalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketPrice = async (req, res, next) => {
  try {
    const { ticketTypeId, newPrice, name, description, nameAr, discount, descriptionAr } = req.body;

    if (newPrice <= 0) {
      return res.status(400).json({ success: false, error: "Price must be a positive number." });
    }

    const updatedTicket = await TicketType.findByIdAndUpdate(
      ticketTypeId,
      { price: newPrice, name, description, nameAr, descriptionAr, discount },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ success: false, error: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: updatedTicket });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const { email } = req.query; // Mock auth via query param for now
    const userEmail = email || "test@example.com";
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const bookings = await Booking.find({ userId: user._id })
      .populate('ticketType')
      .sort({ targetDate: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};
