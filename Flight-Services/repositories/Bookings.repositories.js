import { StatusCodes } from "http-status-codes";
import db from '../models/index.js';// Import the initialized models
import { CrudRepo } from "./crude.repositories.js";

export class BookingsRepo extends CrudRepo {
  constructor() {
    super(db.Booking); // Use the initialized AirPlane model
  }
}
