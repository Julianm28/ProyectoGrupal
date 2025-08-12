require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");

(async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await User.create([
      { name: "Admin CCSS", email: "admin@ccss.com", password: "123456", role: "admin" },
      { name: "Dr. Medico", email: "medico@ccss.com", password: "123456", role: "medico" },
      { name: "Encargado Bodega", email: "bodega@ccss.com", password: "123456", role: "bodega" }
    ]);
    console.log("Seed completado");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
