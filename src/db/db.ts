import mongoose from "mongoose";

mongoose.connect(`${process.env.DB_URL}`);

export const db = mongoose.connection;

const err = (err: any) => console.log("DB 연결 실패", process.env.DB_URL);
const success = () => console.log("✅ DB 연결!");

db.on("error", err);
db.once("open", success);
