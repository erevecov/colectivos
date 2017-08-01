import Joi from 'joi';
import moment from 'moment';
import cloudant from '../../config/cloudant.js';

let db = cloudant.db.use("c_colectivos");

const Colectivos = [{
    method: 'GET',
    path: '/api/colectivos',
    handler: function(request, reply) {

      db.find({
        "selector": {
          "_id": {"$regex": "colectivo"},
        },
        "fields": [
          "_id",
          "_rev",
          "patent",
          "code"
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
    path: '/api/colectivos',
    config: {
        handler: (request, reply) => {
            let id = request.payload.id;
            let rev = request.payload.rev;
            let patent = request.payload.patent;
            let code = request.payload.code;

            db.destroy(id, rev, function(err, result, header) {
              if (!err) {
                db.insert({ patent: patent, code: code }, moment().format('YYYY-MM-DDTHH:mm:ss.zzz')+'_colectivo', function(err, body, header) {
                  if (err) {
                    return console.log(err.message);
                  }else{

                    var newObj = {
                      _id: body.id,
                      _rev: body.rev,
                      patent: patent,
                      code: code
                    }

                    return reply(newObj);
                  }
                });
              }
            });
        },
        validate: {
            payload: Joi.object().keys({
                id: Joi.string(),
                rev: Joi.string(),
                patent: Joi.string(),
                code: Joi.string()
            })
        }
    }
},
{
    method: 'POST',
    path: '/api/colectivos',
    config: {
        handler: (request, reply) => {
            let patent = request.payload.patent;
            let code = request.payload.code;

            db.find({
              "selector": {
                "_id": {"$regex": "colectivo"},
                "patent": patent
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
                  db.insert({ patent: patent, code: code }, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_colectivo', function(err, body, header) {
                    if (err) {
                      return console.log(err.message);
                    }else{

                      var obj = {_id: body.id, _rev: body.rev, patent: patent, code:code};
                      console.log(obj)
                      return reply(obj);
                    }
                  });
                }else{
                  return reply({error: "la patente ya existe"})
                }

              });
        },
        validate: {
            payload: Joi.object().keys({
                patent: Joi.string(),
                code: Joi.string()
            })
        }
    }
},
{
    method: 'DELETE',
    path: '/api/colectivos',
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

export default Colectivos;
