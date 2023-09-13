const { getLogs } = require("./get-logs");
const { methodNotAllowed } = require("../utils");
const {
  getLogsBasedOnTimestamp,
  getLogsBasedOnTimestampRange,
} = require("./timestamp");

const GET_LOGS_ENDPOINT = "/get-logs";
const GET_LOGS_TIMESTAMP_ENDPOINT = "/timestamp";
const GET_LOGS_TIMESTAMP_RANGE = "/timestamp-range";

function routes(req, res) {
  const routeMap = {
    [GET_LOGS_ENDPOINT]: () => getLogs(req, res),
    [GET_LOGS_TIMESTAMP_ENDPOINT]: () => getLogsBasedOnTimestamp(req, res),
    [GET_LOGS_TIMESTAMP_RANGE]: () => getLogsBasedOnTimestampRange(req, res),
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
