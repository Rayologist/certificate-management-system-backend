import app from "./api";
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server] Listening on port ${PORT}`);
});
