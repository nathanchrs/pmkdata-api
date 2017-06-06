'use strict';

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    return next();
  }
};
