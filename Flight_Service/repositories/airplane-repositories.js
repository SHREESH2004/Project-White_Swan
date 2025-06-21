import db from '../models/index.js';// Import the initialized models
import { CrudRepo } from './crud-repositories.js';

export class AirPlanesRepo extends CrudRepo {
  constructor() {
    super(db.AirPlane); // Use the initialized AirPlane model
  }
}
