function methodNotAllowed(req, res) {
  res.writeHead(404);
  res.write("Not Found");
  res.end();
  return;
}

module.exports = {
  methodNotAllowed,
};
