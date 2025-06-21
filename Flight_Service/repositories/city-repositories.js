import db from '../models/index.js';// Import the initialized models
import { CrudRepo } from './crud-repositories.js';

export class CityRepo extends CrudRepo {
  constructor() {
    super(db.City); // Use the initialized AirPlane model
  }
}
