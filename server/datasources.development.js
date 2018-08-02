'use strict';

module.exports = {
  mongo: {
    connector: 'mongodb',
    url: process.env.DATABASE_URL || "mongodb://dwjohnston93:abc123@ds018508.mlab.com:18508/retire-now",
  },
};
