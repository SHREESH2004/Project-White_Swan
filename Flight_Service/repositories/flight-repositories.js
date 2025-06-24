import db from '../models/index.js'; 
import { CrudRepo } from './crud-repositories.js';
export class FlightRepo extends CrudRepo {
  constructor() {
    super(db.Flight); 
  }

  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    try {
      // Lock the flight row for update to prevent race conditions
      await db.Flight.findOne({
        where: { id: flightId },
        transaction,
        lock: transaction.LOCK.UPDATE, // Row-level lock
      });

      let result;

      if (dec) {
        result = await db.Flight.decrement('totalSeats', {
          by: seats,
          where: { id: flightId },
          transaction,
        });
      } else {
        result = await db.Flight.increment('totalSeats', {
          by: seats,
          where: { id: flightId },
          transaction,
        });
      }

      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      console.error("Error updating remaining seats:", err);
      throw err;
    }
  }
}
