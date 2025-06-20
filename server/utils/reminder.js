const Booking = require('../models/Booking');
const { loadTemplate } = require('./email'); // adjust path if needed
const sendMail = require('./email'); // your sendMail function

async function sendBookingReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfDay = new Date(tomorrow.setHours(0,0,0,0));
  const endOfDay = new Date(tomorrow.setHours(23,59,59,999));

  const bookings = await Booking.find({
    checkIn: { $gte: startOfDay, $lte: endOfDay },
    status: 'confirmed',
  }).populate('userId listingId');

  for (const booking of bookings) {
    const placeholders = {
      userName: booking.userId.name,
      listingTitle: booking.listingId.title,
      checkIn: booking.checkIn.toDateString(),
    };
    const reminderHtml = await loadTemplate('bookingReminder.html', placeholders);

    await sendMail({
      to: booking.userId.email,
      subject: 'Booking Reminder',
      html: reminderHtml,
    });
  }
}

module.exports = { sendBookingReminders };
