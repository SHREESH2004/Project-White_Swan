import db from '../models/index.js';// Import the initialized models
import { CrudRepo } from './crud-repositories.js';

export class FlightRepo extends CrudRepo {
  constructor() {
    super(db.Flight); // Use the initialized AirPlane model
  }
}
