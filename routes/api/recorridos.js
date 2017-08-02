import Joi from 'joi';
import moment from 'moment';
import cloudant from '../../config/cloudant.js';

let db = cloudant.db.use("c_recorridos");

const Recorridos = [{
    method: 'GET',
    path: '/api/recorridos',
    handler: function(request, reply) {

      db.find({
        "selector": {
          "_id": {"$regex": "recorrido"},
        },
        "fields": [
          "_id",
          "_rev",
          "name",
          "path"
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
			    db.insert({ name: name, path: path}, moment().format('YYYY-MM-DDTHH:mm:ss.SSS')+'_recorrido', function(err, body, header) {
			      if (err) {
			        return console.log(err.message);
			      }else{
			        var obj = {_id: body.id, _rev: body.rev, name: name};
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
}
];

export default Recorridos;
