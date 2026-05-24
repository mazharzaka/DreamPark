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
    const { ticketTypeId, targetDate, quantity, phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: "Phone number is required." });
    }

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

    // Securely calculate total price with discount
    const pricePerTicket = ticketType.price * (1 - (ticketType.discount || 0) / 100);
    const totalPrice = pricePerTicket * quantity;

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
      phoneNumber,
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
    const { qrCodeId, phoneNumber, bookingId } = req.body;

    let booking;
    // 1. Find Booking using QR Code, Phone, or Booking ID
    if (qrCodeId) {
      booking = await Booking.findOne({ qrCodeId }).populate('ticketTypeId userId');
    } else if (phoneNumber) {
      booking = await Booking.findOne({ phoneNumber, status: 'PENDING_PAYMENT' })
        .populate('ticketTypeId userId')
        .sort({ createdAt: -1 });
    } else if (bookingId) {
      booking = await Booking.findById(bookingId).populate('ticketTypeId userId');
    }

    if (!booking) {
      return res.status(404).json({ success: false, error: "الحجز غير موجود أو رمز التحقق غير صالح" });
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
        customerName: booking.userId ? booking.userId.name : "Guest",
        ticketName: booking.ticketTypeId ? booking.ticketTypeId.name : "Ticket",
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
    const { ticketTypeId, newPrice, name, description, nameAr, discount, descriptionAr, icon, color } = req.body;

    if (newPrice <= 0) {
      return res.status(400).json({ success: false, error: "Price must be a positive number." });
    }

    const updatedTicket = await TicketType.findByIdAndUpdate(
      ticketTypeId,
      { price: newPrice, name, description, color, icon, nameAr, descriptionAr, discount },
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
    const { email } = req.query; // Mock auth via query param if needed, otherwise fallback to req.user.id
    let userId = req.user ? req.user.id : null;

    if (!userId && email) {
      const user = await User.findOne({ email });
      if (user) {
        userId = user._id;
      }
    }

    if (!userId) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const bookings = await Booking.find({ 
      userId
    })
      .populate('ticketTypeId')
      .sort({ targetDate: -1 });

    // Map ticketTypeId to ticketType to match frontend expectations
    const formattedBookings = bookings.map(b => {
      const obj = b.toJSON();
      obj.ticketType = obj.ticketTypeId;
      return obj;
    });

    res.status(200).json({ success: true, data: formattedBookings });
  } catch (error) {
    next(error);
  }
};

export const changeBookingDate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { visitDate } = req.body;

    if (!visitDate) {
      return res.status(400).json({ success: false, error: "New visit date is required." });
    }

    const dateObj = new Date(visitDate);
    if (isNaN(dateObj.getTime()) || dateObj < new Date(new Date().setHours(0, 0, 0, 0))) {
      return res.status(400).json({ success: false, error: "New visit date must be a valid future date." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found." });
    }

    // Verify ownership
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: "You are not authorized to modify this booking." });
    }

    // Verify booking is modifyable (only upcoming/active bookings: PENDING_PAYMENT or PAID)
    if (booking.status !== 'PENDING_PAYMENT' && booking.status !== 'PAID') {
      return res.status(400).json({ success: false, error: "Only active or pending bookings can have their date changed." });
    }

    // Update targetDate
    booking.targetDate = dateObj;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        bookingId: booking._id,
        targetDate: booking.targetDate,
        message: "Visit date updated successfully."
      }
    });
  } catch (error) {
    next(error);
  }
};
