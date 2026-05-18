const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const {
  REDIS_USERNAME = "default",
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

if (!REDIS_PASSWORD || !REDIS_HOST || !REDIS_PORT) {
  console.warn(
    "Redis env not fully configured (REDIS_PASSWORD/REDIS_HOST/REDIS_PORT missing). Skipping Redis connect.",
  );
}

const redis = createClient({
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  },
});

redis.on("error", (err) => console.error("Redis Client Error:", err.message));

(async () => {
  if (!REDIS_PASSWORD || !REDIS_HOST || !REDIS_PORT) return;
  await redis.connect();
  console.log("Redis Cloud connected");
})();

module.exports = redis;
