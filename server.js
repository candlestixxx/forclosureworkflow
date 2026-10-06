const { createServer } = require("http");
const { URL } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = new URL(req.url || "/", "http://" + (req.headers.host || "localhost"));
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: { origin: process.env.NEXTAUTH_URL || "http://localhost:3000", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Attach io to global so API routes can access it if needed (hacky but works for MVP custom server)
  global.io = io;

  // PORT env override: the tray orchestrator runs this on 3002 to avoid
  // colliding with the main CRM on 3000. Keep 3000 as the standalone default.
  const port = Number(process.env.PORT) || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
