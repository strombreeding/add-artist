import app from "./server";
require("dotenv").config();
import "./db/db";
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ 서버 시작! 크롤링 조지러 ㄱㄱ ${PORT} 🛸`));
