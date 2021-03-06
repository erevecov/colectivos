import Joi from 'joi';
import moment from 'moment';
import cloudant from '../../config/cloudant.js';
import QRCode from 'qrcode';

let db = cloudant.db.use("c_paraderos");

const Paraderos = [{
    method: 'GET',
    path: '/api/paraderos',
    config: {
      auth: false,
      handler: function(request, reply) {
      db.find({
        "selector": {
          "_id": {"$regex": "paradero"},
        },
        "fields": [
          "_id",
          "_rev",
          "recorridos",
          "name",
          "lat",
          "lng",
          "base64",
        ],
        "sort": [{
          "_id": "desc"
        }]
        }, function(err, result) {
          if (err) {
            throw err;
          }

          return reply(result.docs);
        });
      }
    }
 
},
{
    method: 'PUT',
    path: '/api/paraderos',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let rev = request.payload.rev;
            let recorridos = JSON.parse(request.payload.recorridos);
            let name = request.payload.name;
            let lat = request.payload.lat;
            let lng = request.payload.lng;


            db.find({
              "selector": {
                "_id": {"$regex": "paradero"},
                "name": name
              },
              "fields": [
                "_id",
                "_rev",
                "recorridos",
                "name",
                "lat",
                "lng",
                "base64"
              ],
              "sort": [{
                "_id": "desc"
              }],
              "limit": 1
              }, function(err, result) {
                if (err) {
                  throw err;
                }


                if(result.docs.length == 0) {

                  console.log(id,rev,recorridos,name,lat,lng)

                  db.destroy(id, rev, function(err, result, header) {
                    if (!err) {
                      QRCode.toDataURL('http://186.64.123.4:3002/?name='+name, function (err, url) {
                        db.insert({ recorridos: recorridos, name: name, lat: lat, lng: lng, base64:url }, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_paradero', function(err, body, header) {
                          if (err) {
                            return console.log(err.message);
                          }else{

                            var newObj = {
                              _id: body.id,
                              _rev: body.rev,
                              recorridos: recorridos,
                              name: name,
                              lat: lat,
                              lng: lng,
                              base64: url
                            }

                            return reply(newObj);
                          }
                        });
                      })
                    }
                  });
                  
                }else{
                  return reply({error: "el paradero de nombre "+ name +" ya existe"})
                }

              });




        },
        validate: {
            payload: Joi.object().keys({
                id: Joi.string(),
                rev: Joi.string(),
                recorridos: Joi.string(),
                name: Joi.string(),
                lat: Joi.string(),
                lng: Joi.string()
            })
        }
    }
},
{
    method: 'PUT',
    path: '/api/paraderosR',
    config: {
      handler: (request, reply) => {
        let id = request.payload.id;
        let rev = request.payload.rev;
        let recorridos = JSON.parse(request.payload.recorridos);
        let name = request.payload.name;
        let lat = request.payload.lat;
        let lng = request.payload.lng;

        db.destroy(id, rev, function(err, result, header) {
          if (!err) {
            QRCode.toDataURL('http://186.64.123.4:3002/?name='+name, function (err, url) {
              db.insert({ recorridos: recorridos, name: name, lat: lat, lng: lng, base64:url }, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_paradero', function(err, body, header) {
                if (err) {
                  return console.log(err.message);
                }else{

                  var newObj = {
                    _id: body.id,
                    _rev: body.rev,
                    recorridos: recorridos,
                    name: name,
                    lat: lat,
                    lng: lng,
                    base64: url
                  }

                  return reply(newObj);
                }
              });
            })
          }else {
            console.log(err)
          }
        });
                  

        },
        validate: {
            payload: Joi.object().keys({
                id: Joi.string(),
                rev: Joi.string(),
                recorridos: Joi.string(), 
                name: Joi.string(),
                lat: Joi.string(),
                lng: Joi.string()
            })
        }
    }
},
{
    method: 'POST',
    path: '/api/searchParadero',
    config: {
      auth: false,
      handler: (request, reply) => {
        let name = request.payload.name;
        
        db.find({
          "selector": {
            "_id": {"$regex": "paradero"},
            "name": name
          },
          "fields": [
            "lat",
            "lng",
            "recorridos"
          ],
          "sort": [{
            "_id": "desc"
          }],
          "limit": 1
          }, function(err, result) {
            if (err) {
              throw err;
            }
            return reply(result.docs[0]);

          });
              

        },
        validate: {
          payload: Joi.object().keys({
            name: Joi.string()
          })
      }
    }
},
{
    method: 'POST',
    path: '/api/paraderos',
    config: {
        handler: (request, reply) => {
            let name = request.payload.name;
            let lat = request.payload.lat;
            let lng = request.payload.lng;

            QRCode.toDataURL('http://186.64.123.4:3002/?name='+name, function (err, url) {
              db.find({
                "selector": {
                  "_id": {"$regex": "paradero"},
                  "name": name
                },
                "fields": [
                  "_id"
                ],
                "sort": [{
                  "_id": "desc"
                }],
                "limit": 1
                }, function(err, result) {
                  if (err) {
                    throw err;
                  }

                  if(result.docs.length == 0) {
                    db.insert({ recorridos:[], name: name, lat: lat, lng: lng, base64: url }, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_paradero', function(err, body, header) {
                      if (err) {
                        return console.log(err.message);
                      }else{

                        var obj = {_id: body.id, _rev: body.rev, name: name, lat: lat, lng: lng, base64: url, recorridos: []};
                        return reply(obj);
                      }
                    });
                  }else{
                    return reply({error: "el paradero de nombre "+ name +" ya existe"})
                  }

                });
              });

        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string(),
                lat: Joi.string(),
                lng: Joi.string()
            })
        }
    }
},
{
    method: 'DELETE',
    path: '/api/paraderos',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let rev = request.payload.rev;

            db.destroy(id, rev, function(err, result, header) {
              if (!err) {
                  return reply(result);
              }
            });
        },
        validate: {
            payload: Joi.object().keys({
                id: Joi.string(),
                rev: Joi.string()
            })
        }
    }
}
];

export default Paraderos;
