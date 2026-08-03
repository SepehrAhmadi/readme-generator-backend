import "dotenv/config";
import express, { type Express } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import corsOptions from "./config/corsOptions";
import routes from "./routes/index";

const app: Express = express();

const PORT = process.env.PORT || 3500;

// =========== middleware ============//
// cross origin resource sharing
app.use(cors(corsOptions));
// built in middleware for form data
app.use(express.urlencoded({ extended: false }));
// built in middleware for json
app.use(express.json());
// middleware for cookies
app.use(cookieParser());
// built in middleware for static files
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
