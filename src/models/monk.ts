import { Schema, model } from "mongoose";

const schema = new Schema({
  key: {
    type: "string",
    required: true,
    index: true,
  },
  value: {
    type: "string",
    required: true,
  },
});

export const MonkSchema = model("monk", schema);
