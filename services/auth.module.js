import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import VoximplantApiClient from '@voximplant/apiclient-nodejs';

import { IsRealMobilePhone, checkIsNotNull } from '../shared/tools/validate.js';
import { AuthProvider } from './auth.provider.js';

import { RegisterSharedSecret } from '../shared/database/models/registerSharedSecret.js';
import { adDecupsChacha } from '../shared/cipher/decupsChachaFile.cjs'; 
import { BadRequestException, Forbidden, NotFound } from '../shared/modules/exceptions/client.exception.js';

dotenv.config();

class AuthModule {
  Auth = new AuthProvider();

  async registerAlternative(body) {
    const { first_name, phone, hash, login, cases } = body;
    try {
      console.log('auth1', this.Auth);
      if(!checkIsNotNull(first_name, phone, hash, login)) throw new Forbidden('Заполнены не все поля')
      if(!IsRealMobilePhone(phone)) throw new Forbidden('Не верный номер телефона');
      if (!Array.isArray(cases)) throw new Forbidden('Нет ответов на вопросы');

      await this.checkExistUser({login, phone}) 
      console.log('auth1',this.Auth);
      const { token, refreshToken, user} = await this.Auth.createNewUser(body);

      return { user, token, refreshToken }
    } catch (error) {
      throw error
    }
  }

  async decriptData(userData) {
    const parsedData = JSON.parse(userData);

    const cipher = Buffer.from(parsedData.cipher);
    const block = Buffer.from(parsedData.block);
    const authTag = Buffer.from(parsedData.authTag);

    const shared_secret = await RegisterSharedSecret.findOne({
      where: {
        socket_id: parsedData.socketId,
      },
      attributes: ['shared_secret'],
    });

    if (shared_secret) {
      const registerData = await adDecupsChacha.DecryptMessage(
        cipher,
        block,
        authTag,
        shared_secret.dataValues.shared_secret
      );

      return JSON.parse(registerData);
    } else {
      console.log('Запись не найдена');
    }
  }

  async register(body) {
    const data = await this.decriptData(body);
    const { first_name, phone, hash, login, cases } = data;

    try {
      if(!checkIsNotNull(first_name, phone, hash, login)) throw new Forbidden('Заполнены не все поля')
      if(!IsRealMobilePhone(phone)) throw new Forbidden('Не верный номер телефона');
      if (!Array.isArray(cases)) throw new Forbidden('Нет ответов на вопросы');

      await this.checkExistUser({login, phone}) 
      
      // Добавление пользователя в Voximplant
      const Vac = VoximplantApiClient.default;
      const client = new Vac('./credentials.json');

      await new Promise((resolve, reject) => {
        client.onReady = async function () {
          try {
            const res = await client.Users.addUser({
              userName: String(data.vox).toLowerCase(),
              userDisplayName: phone,
              userPassword: data.vox_pwd,
              applicationId: '10842914',
            });
            if (Boolean(res.error)) {
              reject(
                new Forbidden('Ошибка регистрации в Voximplant, поменяйте логин')
              );
            } else {
              resolve();
            }
          } catch (error) {
            reject(error);
          }
        };
      });

      const { token, refreshToken, user} = await this.Auth.createNewUser(data);

      return { user, token, refreshToken };
    } catch (error) {
      throw error
    }
  }

  async login(body) {
      try {
      const { phone, hash, notificationToken } = body;
      
      if(!checkIsNotNull(phone, hash)) throw new Forbidden('Заполнены не все поля')
      if(!IsRealMobilePhone(phone)) throw new Forbidden('Не верный номер телефона');

      const user = await this.Auth.findUserByPhone(phone);

      await this.checkAuth(hash, user.hash);
      await this.Auth.updateNotificationToken(user.id, notificationToken);

      const {token, refreshToken} = await this.Auth.createTokens(user.id, phone)

      return { token, refreshToken, userId: user.id }
    } catch (error) {
      throw error
    }
  }
  
  async refresh({ refreshToken }) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Отсутствует токен')
      }
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

      const isPhoneUsed = await this.Auth.isPhoneExist(decoded.phone);
      if(!isPhoneUsed) throw NotFound('Номера телефона не зарегистрирован');
    
      if(await this.isTokenExpired(decoded.exp)) return { status: 200, message: { userId: decoded.id, token: refreshToken }};
      const { refreshToken: newRefreshToken } = await this.Auth.createTokens(decoded.id, decoded.phone)
      return { userId: decoded.id, token: newRefreshToken }
    } catch (error) {
      throw error;
    }
  }

  async checkVersion() {
    try {
      const version = await this.Auth.getVersion();
      return version;
    } catch (error) {
      throw error;
    }
  }

  async createVersion(data) {
    try {
      const newVersion = await this.Auth.createVersion(data);
      return newVersion
    } catch (error) {
      throw error;
    }
  }

  async checkAuth(passedHash, comparedHash) {
    const isPasswordValid = await bcrypt.compare(passedHash, comparedHash);
  
    if (!isPasswordValid) {
      throw new Forbidden('Неверный пароль');
    }
  }
  
  async isTokenExpired(expire) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (expire < currentTime) {
      return true
    } 
    return false
  }
  
  async checkExistUser({login, phone}) {
    const isPhoneUsed = await this.Auth.isPhoneExist(phone);
    if (isPhoneUsed) {
      throw new Forbidden('Пользователь с таким номером телефона уже существует');
    }
  
    const isLoginUsed = await this.Auth.isLoginExist(login);
    if (isLoginUsed) {
      throw new Forbidden('Пользователь с таким логином уже существует');
    }
  }
}


export {AuthModule};
