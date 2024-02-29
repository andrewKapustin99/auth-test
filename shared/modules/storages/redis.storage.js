import Redis from "ioredis";

class RedisModelStorage {
  constructor(modelName) {
    console.log('TEST REDIS !!!!');
    this.redis = new Redis({
      host: 'redis-service',
      port: 6379
    });
    // this.redis = new Redis();
    this.modelName = modelName;
  }

  async set(id, modelData) {
    await this.redis.hmset(`${this.modelName}:${id}`, ...Object.entries(modelData).flat());
  }

  async get(id) {
    const modelData = await this.redis.hgetall(`${this.modelName}:${id}`);
    return modelData;
  }

  async update(id, updatedModelData) {
    await this.redis.hmset(`${this.modelName}:${id}`, ...Object.entries(updatedModelData).flat());
  }

  async delete(id) {
    await this.redis.del(`${this.modelName}:${id}`);
  }

  async quit() {
    await this.redis.quit();
  }
}

export { RedisModelStorage }