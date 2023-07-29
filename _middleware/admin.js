// const { pool, dbQuery } = require('../startup/db');
const db = require('_helpers/db');

const ROLE = Object.freeze({
  unauthorized: 'unauthorized',
  // readOnly: 'readOnly',
  contribute: 'contribute',
  fullAccess: 'fullAccess',
  admin: 'admin'
});

module.exports = ROLE;

// async function userRole (schema, userGuid) {

//   const PREFIX = schema;
//   const users = await dbQuery('SELECT * FROM ' + PREFIX + '.users WHERE usr_guid = $1', [userGuid]);
//   return users[0].usr_role || 'guest';
//   //return 'guest';

// }

module.exports = (levelRole) => {
  return (req, res, next) => {
    if (req.schema !== req.user.schema )  {
      return res.status(403).json({ message: 'Access denied, no permision' }); //.send('Access denied, no permision'); 
    } else if (LEVELS[req.user.role] < LEVELS[levelRole]) return  res.status(403).json({ message: 'Access denied, no permision' }); //.send('Access denied, no permision');
    return next();
  }
}

