import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { BadRequestException, NotFound } from "../shared/modules/exceptions/client.exception.js";
import { InternalServerError } from "../shared/modules/exceptions/server.exception.js";
import { AuthEntity } from "./auth.entity.js"; 
import { userRedisStorage } from '../shared/modules/storages/user.storage.js'; 

export class AuthProvider {
  
  authEntity = new AuthEntity();

  async createNewUser(data) {
    try {
      data.hash = await bcrypt.hash(data.hash, 10);
      const createdUser = await this.authEntity.createUser(data);
      if(!createdUser) throw BadRequestException('Ошибка в полях при создания пользователя');

      const parsedUser = createdUser.toJSON();
      const {cases, ...onlyUserFields} = parsedUser;
      await this.setUserToRedis(onlyUserFields)

      const {token, refreshToken} = await this.createTokens(parsedUser.id, parsedUser.phone)
      
      const newUser = { user: parsedUser, token, refreshToken};
      
      return newUser
    } catch (error) {
      throw error
    }
  }
  
  async findUserByPhone(phone) {
    try {
      const cachedUser = await userRedisStorage.getUserByPhone(phone)
      if(cachedUser) return cachedUser;

      const user = await this.authEntity.checkUser({phone});
      if(!user) throw NotFound('Пользователя не существует');

      await this.setUserToRedis(user)

      return user
    } catch (error) {
      throw error;
    }
  }

  async isPhoneExist(phone){
    try {
      const cachedUser = await userRedisStorage.getUserByPhone(phone)
      if(cachedUser) return true;

      const user = await this.authEntity.checkUser({phone});
      if(!user) return false;

      await this.setUserToRedis(user)

      return true
    } catch (error) {
      throw error;
    }
  }

  async isLoginExist(login) {
    try {
      const user = await this.authEntity.checkUser({login});
      if(user) return true
      
      return false
    } catch (error) {
      throw error;
    }
  }

  async updateNotificationToken(user_id, notificationToken) {
    try {
      const isUpdated = await this.authEntity.updateNotificationToken(user_id, notificationToken);
      if(!isUpdated) throw InternalServerError('Не удалось обновить токен');
    } catch (error) {
      throw error;
    }
  }

  async createTokens(id, phone) {
    const token = await this.signToken({ id, phone }, { secret: process.env.SECRET_KEY, expiresIn: '7d' });
    const refreshToken = await this.signToken({ id, phone }, { secret: process.env.REFRESH_SECRET_KEY, expiresIn: '30d' });
    
    return {token, refreshToken}
  }

  async getVersion() {
    try {
      const version = await this.authEntity.getVersion();
      return version;
    } catch (error) {
      throw error;
    }
  }

  async createVersion(data) {
    try {
      const newVersion = await this.authEntity.createVersion(data);
      return newVersion;
    } catch (error) {
      throw error;
    }
  }

  async signToken(userFields, tokenOptions) {
    const { id, phone } = userFields
    const { secret, expiresIn } = tokenOptions
    return jwt.sign({ id, phone }, secret, { expiresIn });
  }

  async setUserToRedis(user) {
    const {id, phone, ...userData} = user
    await userRedisStorage.setUser(id, phone, userData)
  }
}
