const express = require("express");
// const axios = require("axios");
const redis = require("redis");

const port = process.env.PORT || 3000;

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

async function nodeRedisDemo() {
    try {
      await redisClient.set('mykey', 'Hello from node redis');
      const myKeyValue = await redisClient.get('mykey');
      console.log(myKeyValue);
      await redisClient.set('test', "Hello World");
      await redisClient.set('test1', 'Hello\nWorld');
      await redisClient.set('test2', 'Key-values work');
      await redisClient.set('test3', 'Database linked properly');
      const numAdded = await redisClient.zAdd('vehicles', [
        {
          score: 4,
          value: 'car',
        },
        {
          score: 2,
          value: 'bike',
        },
      ]);
      console.log(`Added ${numAdded} items.`);
  
      for await (const { score, value } of redisClient.zScanIterator('vehicles')) {
        console.log(`${value} -> ${score}`);
      }
  
      await redisClient.quit();
    } catch (e) {
      console.error(e);
    }
  }
  
  nodeRedisDemo();