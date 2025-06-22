export class CrudRepo {
    constructor(model) {
        this.model = model;
    }

    async create(data, options = {}) {
        try {
            return await this.model.create(data, options);
        } catch (error) {
            //logger.error('Something went wrong in CrudRepo: create', { error });
            throw error;
        }
    }

    async destroy(id, options = {}) {
        try {
            return await this.model.destroy({
                where: { id },
                ...options
            });
        } catch (error) {
            //logger.error('Something went wrong in CrudRepo: destroy', { error });
            throw error;
        }
    }

    async get(id, options = {}) {
        try {
            return await this.model.findByPk(id, options);
        } catch (error) {
            //logger.error('Something went wrong in CrudRepo: get', { error });
            throw error;
        }
    }

    async getAll(filter = {}, sort = [], include = [], options = {}) {
        try {
            return await this.model.findAll({
                where: filter,
                order: sort,
                include: include.length ? include : undefined,
                ...options
            });
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: getAll', { error });
            throw error;
        }
    }

    async update(id, newData, options = {}) {
        try {
            return await this.model.update(newData, {
                where: { id },
                ...options
            });
        } catch (error) {
            logger.error('Something went wrong in CrudRepo: update', { error });
            throw error;
        }
    }
}
