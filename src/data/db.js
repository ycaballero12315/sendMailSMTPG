const mongoose = require('mongoose');
require('dotenv').config();

class connectDB {
  constructor() {
    this._connect()
  }

  async _connect() {
    try {
      await mongoose.connection.on('open', async() => {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
         if(!collectionNames.includes(process.env.DB_NAME)){
          await mongoose.connection.db.createCollection(process.env.DB_NAME);
          console.log(`Database ${process.env.DB_NAME} created successfully`);
        }
      });
  
      await mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_NAME}`);
      console.log(`Database connection successful on URI: ${process.env.MONGO_URI} and DB name: ${process.env.DB_NAME}`);
    } catch (error) {
      console.error('Database connection error', error);
    }
  }
}
module.exports = connectDB;
