import Joi from 'joi';
import moment from 'moment';
import cloudant from '../../config/cloudant.js';
import QRCode from 'qrcode';

let db = cloudant.db.use("c_paraderos");

const Paraderos = [{
    method: 'GET',
    path: '/api/paraderos',
    handler: function(request, reply) {

      db.find({
        "selector": {
          "_id": {"$regex": "paradero"},
        },
        "fields": [
          "_id",
          "_rev",
          "name",
          "lat",
          "lng",
          "base64"
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
},
{
    method: 'PUT',
    path: '/api/paraderos',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let rev = request.payload.rev;
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

                  db.destroy(id, rev, function(err, result, header) {
                    if (!err) {
                      QRCode.toDataURL(name+lat+lng, function (err, url) {
                        db.insert({ name: name, lat: lat, lng: lng, base64:url }, moment().format('YYYY-MM-DDTHH:mm:ss.zzz')+'_paradero', function(err, body, header) {
                          if (err) {
                            return console.log(err.message);
                          }else{

                            var newObj = {
                              _id: body.id,
                              _rev: body.rev,
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
                name: Joi.string(),
                lat: Joi.string(),
                lng: Joi.string()
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

            QRCode.toDataURL(name+lat+lng, function (err, url) {
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
                    db.insert({ name: name, lat: lat, lng: lng, base64: url }, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_paradero', function(err, body, header) {
                      if (err) {
                        return console.log(err.message);
                      }else{

                        var obj = {_id: body.id, _rev: body.rev, name: name, lat: lat, lng: lng, base64: url};
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
