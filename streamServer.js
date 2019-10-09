const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 8002,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8003,
    allow_origin: '*'
  },
  https: {
    port: 8005,
    key:'./private.pem',
    cert:'./file.crt',
  }
};

var nms = new NodeMediaServer(config);
exports.nms = nms;
