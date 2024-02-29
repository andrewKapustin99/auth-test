import { faker } from '@faker-js/faker';
import { randomInteger } from '../tools/random.js';
import { sequelize } from './sequelize/sequelize.js';
// import { UserEntity } from '../microservices/modules/entities/user.entity.js';

class DbPopulate {
  // user = new UserEntity();

  async generateTables() {
    await sequelize.sync({ force: true }).then(async () => {
      console.log('Таблицы сгенерированы');
    });
  }
}

export default new DbPopulate();
