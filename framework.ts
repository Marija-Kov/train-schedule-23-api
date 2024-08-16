import * as http from "node:http";
import { IncomingMessage, ServerResponse, Server } from "node:http";
import { gzip } from "node:zlib";

export interface ExtendedServerRes extends ServerResponse {
  sendJson: (statusCode: number, data: Object) => void;
}

export default class F {
  server: Server;
  req: IncomingMessage;
  res: ExtendedServerRes;
  routes: any;
  constructor() {
    this.server = http.createServer();
    this.req = {} as IncomingMessage;
    this.res = {} as ExtendedServerRes;
    this.routes = {
      /* 
       "/rootRoute": (req, res) => {
         // handle potential subroutes here
       }
      */
    };
    this.server.on(
      "request",
      (req: IncomingMessage, res: ExtendedServerRes) => {
        const { url } = req;
        res.sendJson = (statusCode: number, data: Object) => {
          res.statusCode = statusCode;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Content-Encoding", "gzip");
          gzip(JSON.stringify(data), (err, buffer) => {
            if (err) {
              console.error(err);
              return res.end();
            }
            res.end(buffer);
          });
        };
        const goToRoute = (url: string) => {
          /*
         Since this.route method only registers root routes:
         in case url is a subroute, this function will extract
         its root route and find it in this.routes register. 
        */
          const root = "/" + url.split("/")[1];
          if (!this.routes[root]) {
            return res.sendJson(404, { error: "Not found" });
          }
          this.routes[root](req, res);
        };
        url && goToRoute(url);
      }
    );
    this.server.on("error", (error) => {
      console.error("Server error:", error);
    });
  }
  route(
    url: string,
    cb: (req: IncomingMessage, res: ExtendedServerRes) => Promise<any>
  ) {
    /*
     This method registers only root routes ("/trains", "/stations",..).
     The subroutes ("/trains/8003/..",..) should be handled in the cb.
    */
    this.routes[url] = cb;
  }
  listen(port: string | number, cb: Function) {
    return this.server.listen(port, () => {
      cb();
    });
  }
}
