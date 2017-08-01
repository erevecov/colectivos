import Joi from 'joi';

const Admin = [
{
    method: ['GET', 'POST'],
    path: '/admin',
    config: {
        handler: function(request, reply) {
          let session = request.auth.credentials;
          let credentials = {email: session.email, name: session.name, lastname: session.lastname, role: session.role, key: session.key, key_password: session.key_password};

          return reply.view('admin', {credentials});
        }
    }
},
{
    method: ['GET', 'POST'],
    path: '/createC',
    config: {
        handler: function(request, reply) {
          let session = request.auth.credentials;
          let credentials = {email: session.email, name: session.name, lastname: session.lastname, role: session.role, key: session.key, key_password: session.key_password};

          return reply.view('createC', {credentials});
        }
    }
},
{
    method: ['GET', 'POST'],
    path: '/createR',
    config: {
        handler: function(request, reply) {
          let session = request.auth.credentials;
          let credentials = {email: session.email, name: session.name, lastname: session.lastname, role: session.role, key: session.key, key_password: session.key_password};

          return reply.view('createR', {credentials});
        }
    }
}
,
{
    method: ['GET', 'POST'],
    path: '/createP',
    config: {
        handler: function(request, reply) {
          let session = request.auth.credentials;
          let credentials = {email: session.email, name: session.name, lastname: session.lastname, role: session.role, key: session.key, key_password: session.key_password};

          return reply.view('createP', {credentials});
        }
    }
}

];

export default Admin;
