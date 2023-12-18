const mongoose = require('mongoose');
require('dotenv').config();

class ConnectDB {
  constructor() {
    this.connect()
  }

  async connect() {
    try {
      await mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_NAME}`);

      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(collection => collection.name);

      if(!collectionNames.includes(process.env.DB_NAME)){
        await mongoose.connection.db.createCollection(process.env.DB_NAME);
        console.log(`Database ${process.env.DB_NAME} created successfully`);
      }
  
      console.log(`Database connection successful on URI: ${process.env.MONGO_URI} and DB name: ${process.env.DB_NAME}`);

      // Manejador de eventos para el evento 'connected'
      mongoose.connection.on('connected', () => {
        console.log('Mongoose default connection is open to ', process.env.MONGO_URI);
      });
      
      // Manejador de eventos para el evento 'error'
      mongoose.connection.on('error', (err) => {
        console.error('Mongoose default connection has occurred error', err);
      });

      // Manejador de eventos para el evento 'disconnected'
      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection is disconnected');
      });

      // Manejador de eventos para el evento 'SIGINT' (Ctrl+C en la terminal)
      process.on('SIGINT', () => {
        mongoose.connection.close(() => {
          console.log('Mongoose default connection is disconnected due to application termination');
          process.exit(0);
        });
      });
    }catch (error) {
      console.error('Database connection error', error);
    }
  }
}
module.exports = ConnectDB;
