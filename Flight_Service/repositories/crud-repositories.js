import { logger } from "../config/logger-config.js"
export class CrudRepo {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const res = await this.model.create(data);
            return res;
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: create');
            throw error;
        }
    }

    async destroy(id) {
        try {
            const res = await this.model.destroy({
                where: {
                    id: id
                }
            });
            return res;
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: destroy');
            throw error;
        }
    }

    async get(id) {
        try {
            const res = await this.model.findByPk(id);
            return res;
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: get');
            throw error;
        }
    }
    async getAll(filter = {}, sort = [], include = []) {
        try {
            const results = await this.model.findAll({
                where: filter,
                order: sort,
                include: include.length ? include : undefined  // Avoid empty include array
            });
            return results;
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: getAll', { error });
            throw error;
        }
    }



    async update(id, newData) {
        try {
            const res = await this.model.update(newData, {
                where: {
                    id: id
                }
            });
            return res;
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: update');
            throw error;
        }
    }
}
