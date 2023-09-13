const fs = require("fs");
const path = require("path");
const readLine = require("readline");

const { methodNotAllowed } = require("../utils");

/**
 *
 * @param {string} start start Timestamp 
 * @param {string} [end] end Timestamp(optional)
 * @param {Response} [res] Response object(optional)
 * @returns {Promise|void} Returns either a Fulfiled promise with log data or void in the case of range 
 */
function getTimeStampLog(start, end = null, res) {
  start = start.replaceAll("'", "");
  start = start.replaceAll('"', "");

  const readStream = fs.createReadStream(
    path.resolve(`${__dirname}/../example.txt`)
  );
  const logFile = readLine.createInterface({
    input: readStream,
  });

  if (!end) {
    return new Promise((res, rej) => {
      if (isNaN(Date.parse(start))) {
        rej("Not a valid Start Timestamp");
      }

      logFile.on("line", (data) => {
        if (data.split(" ")[0] === start) {
          logFile.removeAllListeners();
          logFile.close();
          readStream.close();
          if (end) {
            res(logFile);
          } else {
            res(data);
          }
        }
      });
      logFile.on("close", () => {
        res("No Data! Invalid TimeStamp");
      });
    });
  } else {
    end = end.replaceAll("'", "");
    end = end.replaceAll('"', "");

    if (end && isNaN(Date.parse(end))) {
      throw new Error("Not a valid End Timestamp");
    }

    let startFlag = false;
    logFile.on("line", (data) => {
      const log = data.split(" ")[0];

      if (log === end) {
        startFlag = false;
        res.write(data);
        logFile.removeAllListeners();
        logFile.close();
        readStream.close();
        res.end();
      } else if (log === start || startFlag) {
        res.write(data + "\n");
        startFlag = true;
      }
    });
    logFile.on("close", () => {
      res.write("No Data! Invalid TimeStamp Range");
      res.end();
    });
  }
}

async function getLogsBasedOnTimestamp(req, res) {
  const supportedParam = "timestamp";
  switch (req.method) {
    case "GET":
      const splitedUrl = req.url.split("?");
      const params = splitedUrl.slice(1, splitedUrl.length)[0].split("&");

      if (params.length > 1 || params[0].split("=")[0] !== supportedParam) {
        res.writeHead(400);
        res.write("Bad Request! Check the params");
        res.end();
        return;
      }
      const reqTimeStampParamValue = decodeURIComponent(
        params[0].split("=")[1]
      );

      try {
        const log = await getTimeStampLog(reqTimeStampParamValue);
        res.writeHead(200);
        res.write(log);
        res.end();
      } catch (e) {
        res.writeHead(400);
        res.write(
          "Bad Request! Invalid Timestamp: " + decodeURI(reqTimeStampParamValue)
        );
        res.end();
      }
      return;
  }

  return methodNotAllowed(req, res);
}

async function getLogsBasedOnTimestampRange(req, res) {
  const supportedParams = ["start", "end"];
  switch (req.method) {
    case "GET":
      const splitedUrl = req.url.split("?");
      const params = splitedUrl.slice(1, splitedUrl.length)[0].split("&");

      if (
        params.length > 2 ||
        params.some((param) => !supportedParams.includes(param.split("=")[0]))
      ) {
        res.writeHead(400);
        res.write("Bad Request! Check the params");
        res.end();
        return;
      }
      const { start, end } = params.reduce((acc, curr) => {
        const param = curr.split("=");

        return {
          ...acc,
          [param[0]]: param[1],
        };
      }, {});

      try {
        getTimeStampLog(start, end, res);
      } catch (e) {
        res.writeHead(400);
        res.write(
          `Bad Request! Invalid Timestamp start: ${decodeURI(
            start
          )} end: ${decodeURI(end)}`
        );
        res.end();
      }
      return;
  }

  return methodNotAllowed(req, res);
}

module.exports = {
  getLogsBasedOnTimestamp,
  getLogsBasedOnTimestampRange,
};
