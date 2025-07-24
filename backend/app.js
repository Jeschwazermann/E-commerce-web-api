const express = require("express");
require("dotenv").config();
const morgan = require("morgan");

const mongoConnect = require("./services/mongo");
const productRoute = require("./Routes/product.routes");

const app = express();

const PORT = process.env.PORT;
const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan("combined"));

app.use(`${api}/products`, productRoute);

const startServer = async (params) => {
  try {
    await mongoConnect();

    app.listen(PORT, () => {
      console.log(api);

      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("failed to start server:", error);
  }
};

startServer();
