import db from '../models/index.js'; // Import initialized models
import { CrudRepo } from './crud-repositories.js';

export class FlightRepo extends CrudRepo {
  constructor() {
    super(db.Flight); // Use the initialized Flight model
  }

  async updateRemainingSeats(flightId, seats, dec = true) {
    if (dec) {
      return await db.Flight.decrement('totalSeats', {
        by: seats,
        where: { id: flightId },
      });
    } else {
      return await db.Flight.increment('totalSeats', {
        by: seats,
        where: { id: flightId },
      });
    }
  }
}
