const fs = require("fs");
const path = require("path");
const readLine = require("readline");

const { methodNotAllowed } = require("../utils");

function getTimeStampLog(timeStamp) {
  timeStamp = timeStamp.replaceAll("'", "");
  timeStamp = timeStamp.replaceAll('"', "");

  return new Promise((res, rej) => {
    if (isNaN(Date.parse(timeStamp))) {
      rej("Not a valid Timestamp");
    }
    const readStream = fs.createReadStream(
      path.resolve(`${__dirname}/../example.txt`)
    );
    const logFile = readLine.createInterface({
      input: readStream,
    });
    logFile.on("line", (data) => {
      if (data.split(" ")[0] === timeStamp) {
        logFile.removeAllListeners();
        logFile.close();
        readStream.close();
        res(data);
      }
    });
  });
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

module.exports = {
  getLogsBasedOnTimestamp,
};
