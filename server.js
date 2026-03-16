const app = require("./src/app");

const connectToDB = require("./src/config/database.js");

connectToDB();

app.listen(3000, () => {
  console.log("server is running on PORT 3000");
});
