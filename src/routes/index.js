const { getLogs } = require("./get-logs");
const { methodNotAllowed } = require("../utils");
const { getLogsBasedOnTimestamp } = require("./timestamp");

const GET_LOGS_ENDPOINT = "/get-logs";
const GET_LOGS_TIMESTAMP_ENDPOINT = "/timestamp";

function routes(req, res) {
  const routeMap = {
    [GET_LOGS_ENDPOINT]: () => getLogs(req, res),
    [GET_LOGS_TIMESTAMP_ENDPOINT]: () => getLogsBasedOnTimestamp(req, res),
  };

  const route = routeMap[req.url.split("?")[0]];

  if (!route) {
    methodNotAllowed(req, res);
  }
  return route();
}

module.exports = {
  routes,
};
