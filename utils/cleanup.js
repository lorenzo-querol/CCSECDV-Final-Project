import { database } from './database';

module.exports = async () => {
    await database.end();
};
