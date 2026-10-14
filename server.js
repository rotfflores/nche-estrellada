// Servidor local de vista previa, sin dependencias. No es un servidor de producción.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".jpg":"image/jpeg", ".png":"image/png", ".webp":"image/webp", ".mp3":"audio/mpeg", ".ogg":"audio/ogg", ".woff2":"font/woff2" };
http.createServer((req,res) => {
  let file;
  try { file = path.resolve(root, "." + decodeURIComponent(new URL(req.url,"http://localhost").pathname)); }
  catch { res.writeHead(400).end(); return; }
  if (file === root) file = path.join(root,"index.html");
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file,(error,stat) => {
    if (error || !stat.isFile()) { res.writeHead(404).end("Not found"); return; }
    const headers = { "Content-Type":mime[path.extname(file)] || "application/octet-stream", "Accept-Ranges":"bytes" };
    const range = req.headers.range && /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]),stat.size-1) : stat.size-1;
      if (start > end || start >= stat.size) { res.writeHead(416,{ "Content-Range":`bytes */${stat.size}` }).end(); return; }
      res.writeHead(206,{...headers,"Content-Range":`bytes ${start}-${end}/${stat.size}`,"Content-Length":end-start+1});
      fs.createReadStream(file,{start,end}).pipe(res);
    } else {
      res.writeHead(200,{...headers,"Content-Length":stat.size});
      fs.createReadStream(file).pipe(res);
    }
  });
}).listen(4173,"127.0.0.1",() => console.log("Invitación: http://localhost:4173"));
