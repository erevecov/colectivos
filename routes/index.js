// HANDLERS
import loginHandler      from './handlers/loginHandler';
import logoutHandler     from './handlers/logoutHandler';

// VIEWS
import Admin             from './admin';

// API
import APIColectivos     from './api/colectivos';
import APIParaderos      from './api/paraderos';

const Login = {
    method: ["GET", "POST"],
    path: "/login",
    config: {
        handler: loginHandler,
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
};

const Logout = {
    method: ["GET", "POST"],
    path: "/logout",
    config: {
        handler: logoutHandler
    }
};

const Home = {
    method: ['GET', 'POST'],
    path: '/',
    config: {
        auth: false,
        handler: function(request, reply) {
            return reply.view('home', {test:'ok'}, { layout: false });
        }
    }
};


const Public = {
    method: "GET",
    path: "/public/{path*}",
    config: { auth: false },
        handler: {
            directory: {
                path: "./public",
                listing: false,
                index: false
            }
        }
};

const Routes = [].concat(
    Public,
    Login,
    Logout,
    Home,
    Admin,
    APIColectivos,
    APIParaderos
);

export default Routes;
