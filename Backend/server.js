const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());   // MUST COME BEFORE ROUTES
app.use("/api", authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.listen(5000, ()=>console.log("Server running on 5000"));