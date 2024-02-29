import { sequelize } from '../shared/database/sequelize/sequelize.js';
import { User, Preference, UserCase, Version }  from '../shared/database/models/index.js';
import { InternalServerError } from '../shared/modules/exceptions/server.exception.js';

export class AuthEntity {
  async createUser(user) {
    const transaction = await sequelize.transaction();
    try {
      const newUser = await User.create(user, { transaction });
      await Preference.create(
        { user_id: newUser.id, theme: 0 },
        { transaction }
      );

      let userCases = [];
      for (const item of user.cases) {
        const userCase = await this.addCase(
          newUser.id,
          item.question,
          item.answer,
          transaction
        );
        userCases.push(userCase.toJSON());
      }

      newUser.dataValues.cases = userCases;
      await transaction.commit();

      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async checkUser(data, attributes){
    try {
      const whereClause = {};

      Object.keys(data).forEach(key => {
        if (data[key]) {
          whereClause[key] = data[key];
        }
      });

      const attributesToRetrieve = attributes || undefined;

      return await User.findOne({
        where: whereClause,
        attributes: attributesToRetrieve,
      });
    } catch (error) {
      throw error;
    }
  }

  async addCase(userId, question, answer, transaction) {
    try {
      const userCase = await UserCase.create(
        { user_id: userId, question, answer },
        { transaction }
      );

      return userCase;
    } catch (error) {
      throw error;
    }
  }

  async updateNotificationToken(user_id, notificationToken) {
    try {
      const [count] = await User.update(
        { notificationToken },
        {
          where: {
            id: user_id,
          },
        }
      );
      return count
    } catch (error) {
      throw error;
    }
  }

  async getVersion() {
    try{
      const versionArray = await Version.findAll();
      if (!versionArray.length) {
        throw InternalServerError('Не удалось найти версию приложения');
      }
      return versionArray[0];
    } catch(error) {
      throw error;
    }
  }

  async createVersion({version, criticalVersion, appSize='100', description='Text'}) {
    try {
      const versionArray = await Version.findAll();
      if (!versionArray.length) {
        return await Version.create({
          app_version: version,
          cirical_app_version: criticalVersion,
          app_size: appSize,
          description
        })
      }
      await versionArray[0].destroy()

      return await Version.create({
        app_version: version,
        cirical_app_version: criticalVersion,
        app_size: '100',
        description
      })
    } catch (error) {
      throw error;
    }
  }
}
