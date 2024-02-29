import { RedisModelStorage } from './redis.storage.js';

class UserRedisStorage extends RedisModelStorage{
  constructor() {
    super('user');
  }

  async setUser(id, phone, userData) {
    await super.set(id, { phone, ...userData });
    await this.redis.hset('user:phone:index', phone, id);
  }
  
  async getUserById(id) {
    const userData = await super.get(id);
    return userData ? { id, ...userData } : null;
  }

  async getUserByPhone(phone) {
    const id = await this.redis.hget('user:phone:index', phone);
    if (id) {
      return await this.getUserById(id);
    }
    return null;
  }

  async deleteUser(id) {
    const userData = await super.get(id);
    if (userData) {
      await super.delete(id);
      await this.redis.hdel('user:phone:index', userData.phone);
      return true;
    }
    return false;
  }
}

const userRedisStorage = new UserRedisStorage();

export { userRedisStorage }