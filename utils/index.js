import fs from "fs";

export const getMimeTypes = () => ({
  ".ico": "image/x-icon",
  ".md": "text/plain",
  ".html": "text/html",
  ".js": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".eot": "appliaction/vnd.ms-fontobject",
  ".ttf": "aplication/font-sfnt",
});

export const checkIfExists = (filepath) => {
  return new Promise((resolve) => {
    fs.stat(filepath, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
