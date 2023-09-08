const fs = require("fs");
const path = require("path");

const { methodNotAllowed } = require("../utils");

function getLogs(req, res) {
  switch (req.method) {
    case "GET":
      const readStream = fs.createReadStream(
        path.resolve(`${__dirname}/../example.txt`)
      );

      res.writeHead(200);
      readStream.pipe(res);
      return;
  }

  return methodNotAllowed(req, res);
}

module.exports = {
  getLogs,
};
