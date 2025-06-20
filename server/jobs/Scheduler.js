const cron = require('node-cron');
const { sendBookingReminders } = require('../utils/reminder');

function startScheduler() {
  // Run at 8 AM every day:
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily booking reminders...');
    try {
      await sendBookingReminders();
      console.log('Booking reminders sent.');
    } catch (error) {
      console.error('Error sending booking reminders:', error);
    }
  });
}

module.exports = { startScheduler };
