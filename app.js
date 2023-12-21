import http from "http";
import url, { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import zlib from "zlib";
import { getMimeTypes, checkIfExists } from "./utils/index.js";
const mimeTypes = getMimeTypes();

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);
  const ext = path.extname(pathname); // 暂未考虑不存在后缀名的情况
  // 判断后缀名是否合法
  if (!mimeTypes[ext]) {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    return res.end("404 Not Found");
  }
  const filepath = path.join(__dirname, pathname);
  // 判断文件是否存在
  const fileExists = await checkIfExists(filepath);
  if (!fileExists) {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    return res.end("404 Not Found");
  }
  // 304缓存有效期判断，使用If-Modified-Since，使用ETag也行
  const fStat = fs.statSync(filepath);
  // 文件最后修改时间
  const fileModifiedTime = fStat.mtime.toUTCString();
  // 客户端请求的最后修改时间
  const ifModifiedSince = req.headers["if-modified-since"];
  if (ifModifiedSince && ifModifiedSince >= fileModifiedTime) {
    res.statusCode = 304;
    res.setHeader("Content-Type", mimeTypes[ext]);
    res.setHeader("Last-Modified", fileModifiedTime);
    res.end();
    return;
  }
  // 文件头信息设置
  res.statusCode = 200;
  res.setHeader("Content-Type", mimeTypes[ext]);
  res.setHeader("Cache-Control", `public, max-age=3600`);
  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Last-Modified", fileModifiedTime);
  // gzip 压缩后，把文件流 pipe 回去
  const stream = fs.createReadStream(filepath);
  stream.pipe(zlib.createGzip()).pipe(res);
});

const PORT = 3000;
server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
server.on("error", (error) => console.log(error));
