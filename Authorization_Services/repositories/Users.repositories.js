import { StatusCodes } from "http-status-codes";
import db from '../models/index.js';
import { CrudRepo } from "./crud.repositoreis.js";

export class UsersRepo extends CrudRepo {
  constructor() {
    super(db.User);
  }
}