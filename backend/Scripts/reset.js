const { sequelize } = require('../db/models');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose(); // Add SQLite3

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, error);
        return reject(error);
      }
      console.log(stdout);
      console.error(stderr);
      resolve(stdout);
    });
  });
};

const dropAllTables = async () => {
  try {
    console.log('Dropping all tables...');
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    await sequelize.query('DROP TABLE IF EXISTS `Bookings`;');
    await sequelize.query('DROP TABLE IF EXISTS `Reviews`;');
    await sequelize.query('DROP TABLE IF EXISTS `ReviewImages`;');
    await sequelize.query('DROP TABLE IF EXISTS `Spots`;');
    await sequelize.query('DROP TABLE IF EXISTS `SpotImages`;');
    await sequelize.query('DROP TABLE IF EXISTS `Users`;');
    await sequelize.query('DROP TABLE IF EXISTS `SequelizeMeta`;');
    await sequelize.query('DROP TABLE IF EXISTS `SequelizeData`;');
    await sequelize.query('PRAGMA foreign_keys = ON;');
    console.log('All tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  }
};

const clearSequelizeDataUsingSQLite3 = async () => {
  try {
    const db = new sqlite3.Database('db/dev.db'); // Adjust path to your SQLite file

    db.serialize(() => {
      db.run('DELETE FROM SequelizeData', function (err) {
        if (err) {
          console.error('Error clearing SequelizeData:', err);
        } else {
          console.log('Successfully cleared SequelizeData');
        }
      });
    });

    db.close();
  } catch (error) {
    console.error('Error accessing SQLite database:', error);
  }
};

const resetDatabase = async () => {
  try {
    // Drop all tables manually
    await dropAllTables();

    // Undo all migrations to force a reset
    console.log('Undoing all migrations...');
    await runCommand('npx dotenv sequelize-cli db:migrate:undo:all');

    // Run migrations again to recreate all tables
    console.log('Running migrations...');
    await runCommand('npx dotenv sequelize-cli db:migrate');

    // Use sqlite3 to manually clear SequelizeData
    console.log('Manually clearing SequelizeData table using sqlite3...');
    await clearSequelizeDataUsingSQLite3();

    // Run seeders
    console.log('Running seeders...');
    await runCommand('npx dotenv sequelize-cli db:seed:all');

    console.log('Database reset complete.');
  } catch (error) {
    console.error('Error resetting the database:', error);
  } finally {
    await sequelize.close(); // Close the connection after operation
  }
};

// Run the reset function
resetDatabase();
