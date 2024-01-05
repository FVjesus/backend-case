const Audit = require('../models/auditModel');

const authorize = (roles) => {
  return async  (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      await Audit.create({ userId: req.user._id, documentId: req.params.id, action: 'authorize' });
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};

module.exports = authorize;