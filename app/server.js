const strapi = require("strapi");
strapi().start();

process.on('SIGINT', function() {
  strapi().destroy().then(() => process.exit(err ? 1 : 0))
});
