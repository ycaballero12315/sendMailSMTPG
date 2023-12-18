require('dotenv').config();

const express = require("express");
const router = require("./routes/routes.js");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const path = require("path");
const createError = require('http-errors');
const connectDB = require('./data/db.js');
const sendMailAuto = require('../src/helpers/sendMailAuto.js');

const app = express();
const port = process.env.PORT;

// Para conectar a express detrasde un proxy, para en caso que se necesario
app.set('trust proxy', 1)

//Limitar la cantidas de peticiones por ip
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Demaciadas peticiones desde este IP. Por favor intente dentro de 15 min'
})

//MongoDB connection
new connectDB();

// Configuración de vistas y directorios estáticos
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "pug");

//Morgan solo para entorno de desarrollo, se puede vosualizar por consola los res y req
if(process.env.NODE_ENV === "develoment"){
  app.use(morgan('dev'));
}

// Middleware a nivel de dirección
app.use(limiter);

// Enrutador
app.use(router);

// Manejo de errores 404
app.use((req, res, next) => next(createError(404)));

// Manejo de errores general
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Envío automático de correos
sendMailAuto();

// Inicio del servidor
const start = async ()=> {
  try {
    //middleware application level
    app.listen(port, () => {
      const host = process.env.HOST;
      console.log("server running at http://" + host + ":" + port);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}
start()

