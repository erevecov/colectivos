const logout = function(request, reply) {

    request.cookieAuth.clear();
    return reply.redirect('/login');
};
export default logout;
