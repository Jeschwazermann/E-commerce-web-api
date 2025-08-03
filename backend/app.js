const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const authJwt = require("./middleware/protectroutes");
const mongoConnect = require("./services/mongo");
const categoriesRoutes = require("./Routes/category.routes");
const productsRoutes = require("./Routes/product.routes");
const usersRoutes = require("./Routes/user.routes");
const ordersRoutes = require("./Routes/order.routes");
const errorHandler = require("./middleware/error.handler");

const app = express();

const PORT = process.env.PORT;
const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

const startServer = async () => {
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
