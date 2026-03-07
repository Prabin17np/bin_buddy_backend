import dotenv from "dotenv";

dotenv.config();

// Info: Application level constant, with fallbacks
// Info: if .env variables are not set
export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3000;
export const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb+srv://prabin17np_db_user:6IhiZef6EwFOoSU2@cluster0.ep4oifp.mongodb.net/bin_buddy_backend";
export const JWT_SECRET: string = process.env.JWT_SECRET || "mysecretkey";