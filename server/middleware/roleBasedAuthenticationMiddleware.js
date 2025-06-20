const { error } = require('../utils')

const roleBasedAuthenticationMiddleware = (...allowedRoles) => {
    console.log('Role-based authentication middleware initialized with roles:', allowedRoles);
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        throw new Error('At least one role must be specified');
    }
    return (req, res, next) => {
        const user = req.user;
        console.log("user:", req.user);
        if (!user) {
            return error.forbidden(res, 'User not well specified');
        }
        const hasRole = allowedRoles.includes(user.role);
        if (!hasRole) {
            return error.forbidden(res, "You don't have permissions to do that");
        }
        next();
    };
}

module.exports = roleBasedAuthenticationMiddleware;
