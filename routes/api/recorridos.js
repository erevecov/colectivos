import Joi from 'joi';
import moment from 'moment';
import cloudant from '../../config/cloudant.js';

let db = cloudant.db.use("c_recorridos");

const Recorridos = [{
    method: 'GET',
    path: '/api/recorridos',
    config: {
      auth: false,
      handler: function(request, reply) {

      db.find({
        "selector": {
          "_id": {"$regex": "recorrido"},
        },
        "fields": [
          "_id",
          "_rev",
          "name",
          "path",
          "colectivos"
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
    method: 'POST',
    path: '/api/searchRecorridos',
    config: {
      auth: false,
      handler: (request, reply) => {
        let name = request.payload.name;
        
        db.find({
          "selector": {
            "_id": {"$regex": "recorrido"},
            "name": "egj"
          },
          "fields": [
   
          ],
          "sort": [{
            "_id": "desc"
          }],
          "limit": 1
          }, function(err, result) {
            if (err) {
              throw err;
            }

            console.log(result)
            return reply(result.docs);

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
    path: '/api/recorridos',
    config: {
      handler: (request, reply) => {
        let name = request.payload.name;
        let path = JSON.parse(request.payload.path);

            
			db.find({
			"selector": {
			  "_id": {"$regex": "recorrido"},
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
			    db.insert({ name: name, path: path, colectivos: []}, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_recorrido', function(err, body, header) {
			      if (err) {
			        return console.log(err.message);
			      }else{
			        var obj = {_id: body.id, _rev: body.rev, name: name, path:path, colectivos: []};
			        return reply(obj);
			      }
			    });
			  }else{
			    return reply({error: "el recorrido de nombre "+ name +" ya existe"});
			  }

			});
             

        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string(),
                path: Joi.string()
            })
        }
    }
},
{
  method: 'PUT',
  path: '/api/recorridos',
  config: {
      handler: (request, reply) => {
        let id = request.payload.id;
        let rev = request.payload.rev;
        let name = request.payload.name;
        let path = JSON.parse(request.payload.path);
        let colectivos = JSON.parse(request.payload.colectivos);


        console.log(id, rev, name, path, colectivos)

        db.destroy(id, rev, function(err, result, header) {
          if (!err) {
            
            db.insert({ name: name, path: path, colectivos: colectivos }, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_recorrido', function(err, body, header) {
              if (err) {
                return console.log(err.message);
              }else{

                var newObj = {
                  _id: body.id,
                  _rev: body.rev,
                  name: name,
                  path: path,
                  colectivos: colectivos
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
              name: Joi.string(),
              path: Joi.string(),
              colectivos: Joi.string()
          })
      }
  }
},
{
    method: 'DELETE',
    path: '/api/recorridos',
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

export default Recorridos;
