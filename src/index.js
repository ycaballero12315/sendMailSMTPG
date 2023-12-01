require('dotenv').config();
const router = require("./routes/routes.js");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const path = require("path");
const createError = require('http-errors');
const connectDB = require('./data/db.js');
const app = express();
const sendMailAuto = require('../src/helpers/sendMailAuto.js');

// Para conectar a express detrasde un proxy, para en caso que se necesario
app.set('trust proxy', 1)
//Limitar la cantidas de peticiones por ip
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Demaciadas peticiones desde este IP. Por favor intente dentro de 15 min'
})

const port = process.env.PORT;

//MongoDB connection
new connectDB();
// concatenar el directorio de las vistas de motores de plantillas
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "pug");
//Morgan solo para entorno de desarrollo, se puede vosualizar por consola los res y req
app.use(morgan("dev"));
//middleware address level
app.use(limiter);
app.use(router);
// app.use(err);
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
sendMailAuto();
const start = async ()=> {
  try {
    //middleware application level
    app.listen(port, () => {
      const host = process.env.HOST;
      console.log("server running at http://" + host + ":" + port);
    });
  } catch (error) {
      express.error.status(error.status || 500);
      express.render(error);
      express.error.log(error);
  }
}
start()

