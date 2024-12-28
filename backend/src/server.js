import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`App is running on http://localhost:${PORT}`);
});
