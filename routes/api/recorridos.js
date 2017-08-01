import Joi from 'joi';
import moment from 'moment';
import cloudant from '../../config/cloudant.js';

let db = cloudant.db.use("c_recorridos");

const Paraderos = [{
    method: 'GET',
    path: '/api/recorridos',
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
    method: 'POST',
    path: '/api/paraderos',
    config: {
        handler: (request, reply) => {
            let name = request.payload.name;

            
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
			    db.insert({ name: name}, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_recorrido', function(err, body, header) {
			      if (err) {
			        return console.log(err.message);
			      }else{

			        var obj = {_id: body.id, _rev: body.rev, name: name};
			        return reply(obj);
			      }
			    });
			  }else{
			    return reply({error: "el paradero de nombre "+ name +" ya existe"})
			  }

			});
             

        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string()
            })
        }
    }
}
];

export default Paraderos;
