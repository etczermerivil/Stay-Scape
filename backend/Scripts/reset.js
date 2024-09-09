const { sequelize } = require('../db/models');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose(); // Add SQLite3 for development

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

const dropAllTablesDevelopment = async () => {
  try {
    console.log('Dropping all tables (SQLite - Development)...');
    const db = new sqlite3.Database('db/dev.db'); // Adjust path to your SQLite file
    db.serialize(() => {
      db.run('PRAGMA foreign_keys = OFF;');
      db.run('DROP TABLE IF EXISTS `Bookings`;');
      db.run('DROP TABLE IF EXISTS `Reviews`;');
      db.run('DROP TABLE IF EXISTS `ReviewImages`;');
      db.run('DROP TABLE IF EXISTS `Spots`;');
      db.run('DROP TABLE IF EXISTS `SpotImages`;');
      db.run('DROP TABLE IF EXISTS `Users`;');
      db.run('DROP TABLE IF EXISTS `SequelizeMeta`;');
      db.run('DROP TABLE IF EXISTS `SequelizeData`;');
      db.run('PRAGMA foreign_keys = ON;');
    });
    db.close();
    console.log('All tables dropped successfully in development.');
  } catch (error) {
    console.error('Error dropping tables in development:', error);
  }
};

const clearSequelizeDataTableDevelopment = async () => {
  try {
    const db = new sqlite3.Database('db/dev.db');

    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='SequelizeData';",
      (err, row) => {
        if (err) {
          console.error('Error checking for SequelizeData table:', err);
        } else if (row) {
          // If the table exists, delete all rows
          db.run('DELETE FROM SequelizeData;', (deleteErr) => {
            if (deleteErr) {
              console.error('Error deleting from SequelizeData:', deleteErr);
            } else {
              console.log('Successfully cleared SequelizeData in development.');
            }
          });
        } else {
          console.log('SequelizeData table does not exist. Skipping...');
        }
      }
    );

    db.close();
  } catch (error) {
    console.error('Error accessing SQLite database in development:', error);
  }
};

const dropAllTables = async () => {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    try {
      console.log('Dropping all tables (PostgreSQL - Production)...');
      await sequelize.query('DROP TABLE IF EXISTS "Bookings" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "Reviews" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "ReviewImages" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "Spots" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "SpotImages" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;');
      await sequelize.query('DROP TABLE IF EXISTS "SequelizeData" CASCADE;');
      console.log('All tables dropped successfully in production.');
    } catch (error) {
      console.error('Error dropping tables in production:', error);
    }
  } else {
    await dropAllTablesDevelopment(); // Use sqlite3 for development
  }
};

const resetDatabase = async () => {
  const env = process.env.NODE_ENV || 'development'; // Default to development if NODE_ENV is undefined

  try {
    // Drop all tables manually
    await dropAllTables();

    // Undo all migrations to force a reset
    console.log(`Undoing all migrations (${env})...`);
    await runCommand(`npx dotenv sequelize-cli db:migrate:undo:all --env ${env}`);

    // Run migrations again to recreate all tables
    console.log(`Running migrations (${env})...`);
    await runCommand(`npx dotenv sequelize-cli db:migrate --env ${env}`);

    // Clear the SequelizeData table if it exists
    if (env === 'production') {
      console.log('Clearing SequelizeData table (PostgreSQL - Production)...');
      await sequelize.query('DELETE FROM "SequelizeData";');
    } else {
      console.log('Checking and clearing SequelizeData table (SQLite - Development)...');
      await clearSequelizeDataTableDevelopment(); // Check and delete in SQLite
    }

    // Run seeders
    console.log(`Running seeders (${env})...`);
    await runCommand(`npx dotenv sequelize-cli db:seed:all --env ${env}`);

    console.log(`Database reset complete (${env}).`);
  } catch (error) {
    console.error('Error resetting the database:', error);
  } finally {
    await sequelize.close(); // Close the connection after operation
  }
};

// Run the reset function
resetDatabase();
