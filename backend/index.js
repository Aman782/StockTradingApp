require("dotenv").config();

const express = require("express");
// const app = express();
const mongoose = require("mongoose");

// const bodyParser = requi re("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

const { HoldingsModel } = require("./models/HoldingsModel");

const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
// app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(uri)
  .then(() => console.log("DB connected successfully!"))
  .catch((err) => console.error("DB connection error:", err));

  app.listen(PORT, () => {
    console.log("App started!");
  });


app.get("/allHoldings", async (req, res) => {
    try {
      let allHoldings = await HoldingsModel.find({});
      res.json(allHoldings);
    } catch (err) {
      console.error("Error fetching holdings:", err);
      res.status(500).send("Server error");
    }
  });
  

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  newOrder.save();

  res.send("Order saved!");
});

app.use(express.json());
app.use("/", authRoute);


