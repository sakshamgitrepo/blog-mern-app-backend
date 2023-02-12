const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const multer = require("multer");

connectDB();

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('uploads'));
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploadMiddleware = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("<h1>Mern blog app server running</h1>");
});
app.use("/user", require("./routes/userRoutes"));
app.use(
  "/blogs",
  uploadMiddleware.single("file"),
  require("./routes/postRoutes")
);

console.log(__dirname);

app.listen(port, () => console.log(`Server started on port ${port}`));
