import db from '../models/index.js';// Import the initialized models
import { CrudRepo } from './crud-repositories.js';

export class AirportsRepo extends CrudRepo {
  constructor() {
    super(db.Airport); // Use the initialized AirPlane model
  }
}
