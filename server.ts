import F from "./framework";
import * as handler from "./routes/handlers";

const port = process.env.PORT || 3003;

const server = new F();

server.route("/trains", handler.trains);

server.route("/stations", handler.stations);

server.route("/departures", handler.departures);

server.route("/", async (req, res) => {
  const { method } = req;
  if (method !== "GET") {
    return res.sendJson(405, { error: "Method Not Allowed" });
  }
  return res.sendJson(200, { message: "Welcome to the train schedule API!" });
});

// This prevents app from crashing when browsers ask for favicon:
server.route("/favicon.ico", async (req, res) => {
  return res.end();
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
