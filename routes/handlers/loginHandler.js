import Boom from 'boom';
import Joi from 'joi';
import cloudant from '../../config/cloudant.js';

let uuid = 1;
const login = function(request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    let message = '';
    let account = {};

    if (request.method === 'post') {
        if (!request.payload.username || !request.payload.password) {
            Boom.expectationFailed('Falta Usuario o Contraseña');
        } else {
            let post_email = request.payload.username;
            let post_password = request.payload.password;

            let db = cloudant.db.use("c_users");

            db.find({
              "selector": {
                "_id": {"$regex": "user"},
                "email": post_email,
                "password": post_password,
              },
              "fields": [
                "name",
                "lastname",
                "email",
                "role"
              ],
              "sort": [{
                "_id": "desc"
              }],
              "limit":1
              }, function(err, result) {
                if (err) {
                  throw err;
                }
                console.log(result)

                if(result.docs[0]) {
                  account = result.docs[0];

                  const sid = String(++uuid);
                  request.server.app.cache.set(sid, { account: account }, 0, (err) => {
                     if (err) {
                         Boom.badImplementation(err);
                     }

                     request.cookieAuth.set({ sid: sid });
                     return reply.redirect('admin');
                 });

                }else {
                  reply.view('login', { error: 'Usuario y/o contraseña no corresponden' }, { layout: false });
                }

              });
        }
    }

    if (request.method === 'get') {
        return reply.view('login', { title: 'test' }, { layout: false });
    }
};

export default login;
