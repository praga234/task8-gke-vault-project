const http = require("http");
const mysql = require("mysql2");

// MySQL Connection
const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root123",
  database: "socdb"
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err);
    return;
  }

  console.log("Connected to MySQL");
});

const server = http.createServer((req, res) => {

  // GET /alerts
  if (req.url === "/alerts" && req.method === "GET") {

    db.query(
      "SELECT * FROM alerts",
      (err, results) => {

        if (err) {
          res.writeHead(500);
          res.end("Database Error");
          return;
        }

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });

        res.end(JSON.stringify(results));
      }
    );
  }

  // POST /alerts
  else if (req.url === "/alerts" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {

      const alert = JSON.parse(body);

      db.query(
        "INSERT INTO alerts (alert_name, severity, status) VALUES (?, ?, ?)",
        [
          alert.alert_name,
          alert.severity,
          "Open"
        ],
        (err, result) => {

          if (err) {
            res.writeHead(500);
            res.end("Database Error");
            return;
          }

          res.writeHead(201, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          });

          res.end(JSON.stringify({
            message: "Alert Created",
            alert_id: result.insertId
          }));
        }
      );
    });
  }

  // OPTIONS (CORS)
  else if (req.method === "OPTIONS") {

    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end();
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }

});

server.listen(3000, () => {
  console.log("SOC Alert API running on port 3000");
});