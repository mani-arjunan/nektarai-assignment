## Simple node server to get logs based on timestamp from the logs txt file(should be attached in the repo).

### npm run start
Starts the local node server in the port `3000`

### Endpoints

 - /get-logs(GET) - Get the entire logs from the attached file(example.txt).
 - /timestamp?timestamp="TIMESTAMP"(GET) - Get a specific log based on the request param timestamp value.<br/>EG: /timestamp?timestamp='2020-01-18T07:34:09.451Z' will fetch the logs from the mentioned timestamp in the param.
 - /timestamp-range?start="TIMESTAMP"&end="TIMESTAMP"(GET) - Get logs based on start and end range.<br/>EG: /timestamp?start=2020-01-01T00:00:40.528Z&end=2020-01-01T00:02:23.387Z  will fetch logs from start to end.