const http = require("http");
const { routes } = require("./src/routes");

const server = http.createServer(routes);

server.listen(3000, "localhost");
