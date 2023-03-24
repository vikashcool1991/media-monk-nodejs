import { MonkSchema } from "../models/monk";

export async function getValueByKey(req, res) {
  const { key } = req.params;
  if (!key) {
    res.status(400).send("Bad Request");
    return;
  }
  try {
    const valueInRedis = await global.redisClient.get(key);
    if (!valueInRedis) {
      const doc = await MonkSchema.findOne({ key });
      if (!doc) {
        res.status(404).send("Key not found");
        return;
      }
      await global.redisClient.set(doc.key, doc.value);
      res.status(200).send({ value: doc.value });
      return;
    }
    res.status(200).send({ value: valueInRedis });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
