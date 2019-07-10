var express= require('express');
var router = express.Router();

function iApi(db){

  var incidentesRoutes = require('./api/incidentes')(db);
  router.use('/incidentes',incidentesRoutes );
  
  return router;
}

module.exports = iApi;



