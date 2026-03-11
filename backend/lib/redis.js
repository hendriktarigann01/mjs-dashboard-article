const { createClient } = require("redis");

const redis = createClient({
  username: "default",
  password: "WyWPpQFh9f9A1HiZdFrNyG3KymsA8C1E",
  socket: {
    host: "redis-17970.c334.asia-southeast2-1.gce.cloud.redislabs.com",
    port: 17970,
  },
});

redis.on("error", (err) => console.error("Redis Client Error:", err.message));

// Connect saat module pertama kali di-load
(async () => {
  await redis.connect();
  console.log("Redis Cloud connected");
})();

module.exports = redis;
