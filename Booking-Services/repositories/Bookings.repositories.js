import { StatusCodes } from "http-status-codes";
import db from '../models/index.js';
import { CrudRepo } from "./crud.repositories.js";

export class BookingsRepo extends CrudRepo {
  constructor() {
    super(db.Booking);
  }

  async createBooking(data, transaction) {
    const response = await db.Booking.create(data, { transaction });
    return response;
  }
}
