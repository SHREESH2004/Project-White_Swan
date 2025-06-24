import schedule from 'node-schedule';
import BookingService from '../../services/Bookings.services.js';

const bookingService = new BookingService();

function scheduleCrons() {
    schedule.scheduleJob('*/10 * * * * *', async () => {
        try {
            const cancelled = await bookingService.cancelOldBookings();
            console.log(`[${new Date().toISOString()}] Cancelled ${cancelled.length || 0} old bookings.`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error during scheduled booking cleanup:`, error);
        }
    });
}

export default scheduleCrons;
