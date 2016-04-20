"use strict";
const crypto = require('crypto')
module.exports = (v) => crypto.createHash('sha256').update(v).digest('hex')
