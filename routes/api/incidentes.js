
var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;




function iIncidentes(db) {
  var INCIDENTESCOLL = db.collection('incidentes');
  router.get('/', (req, res, next)=>{
    INCIDENTESCOLL.find().toArray((err, incidentes)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"Error al extraer los datos"});
      }
      return res.status(200).json(incidentes);
    });
  }); // get 
  router.get('/:id', (req, res, next)=>{
    var id = new ObjectID(req.params.id);
    INCIDENTESCOLL.findOne({"_id": id} , (err, doc)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se pudo obtener los datos"});
      }
      return res.status(200).json(doc);
    });//findOne
  }); // /por id

  /**
 * 
 descripcion
fechaYHora
tipo [Incidente, Recurrente, Problema, Externo]
estado [Registrado, En Proceso, Verificando, Cerrado, Rechazado]
usuarioRegistra
usuarioAsignado
fechaHoraAsignado
fechaHoraCerrado
 * 
 */

  router.post('/', (req, res, next)=>{
    var NuevoIncidente = Object.assign(
      {},
      {
        "descripcion":"",
        "fechaYHora":new Date().getTime(),
        "tipo":"",
        "estado":"",
        "usuarioRegistra":"",
        "fechaHoraAsignado":new Date().getTime(),
        "fechaHoraCerrado":new Date().getTime()
      },
      req.body
    );
    INCIDENTESCOLL.insertOne(NuevoIncidente, (err, rslt)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se pudo agregar nuevo el nuevo dato"});
      }
      if(rslt.ops.length===0){
        console.log(rslt);
        return res.status(404).json({ "error": "No se pudo agregar el nuevo dato" });
      }
      return res.status(200).json(rslt.ops[0]);
    });
  });// post


  //here put and delete commit

router.put('/asign/:id ', (req, res, next)=>{
  var query = {"_id":new ObjectID(req.params.id)};
  var update = {"$set":{"usuarioRegistra":"xyz", "estado":"asignado","fechaHoraAsignado":" " }};

  INCIDENTESCOLL.updateOne(query, update, (err, rslt)=>{
    if (err) {
      console.log(err);
      return res.status(404).json({ "error": "No se pudo modificar " });
    }
    
    return res.status(200).json(rslt);
  })
}); // put asing

router.put('/close/:id ', (req, res, next)=>{
  var query = {"_id":new ObjectID(req.params.id)};
  var update = {"$set":{"usuarioRegistra":"xyz", "estado":"cerrado","fechaHoraAsignado":" " }};

  INCIDENTESCOLL.updateOne(query, update, (err, rslt)=>{
    if (err) {
      console.log(err);
      return res.status(404).json({ "error": "No se pudo modificar " });
    }
    
    return res.status(200).json(rslt);
  })
}); // put close

router.delete('/:id', (req, res, next) => {
  var query = { "_id": new ObjectID(req.params.id) };
  INCIDENTESCOLL.removeOne(query, (err, rslt) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ "error": "No se pudo eliminar" });
    }

    return res.status(200).json(rslt);
  })
}); // delete


  return router;
}

module.exports = iIncidentes;