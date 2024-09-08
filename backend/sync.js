const { sequelize } = require('./db/models');  // Adjust this path to your Sequelize models

const resetDatabase = async () => {
  try {
    // Force sync to drop all tables and recreate them
    await sequelize.sync({ force: true });
    console.log("Database reset successfully.");
  } catch (err) {
    console.error("Error resetting database: ", err);
  } finally {
    process.exit();
  }
};

resetDatabase();
