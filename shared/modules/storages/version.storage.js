import { RedisModelStorage } from './redis.storage.js';

class VersionRedisService extends RedisModelStorage {
  constructor() {
    super('version');
  }

  async getVersionById(id) {
    const versionData = await super.getModel(id);
    return versionData ? { id, ...versionData } : null;
  }

  async deleteVersionById(id) {
    await super.deleteModel(id);
  }
}
  
const versionRedisService = new VersionRedisService();

export { versionRedisService }