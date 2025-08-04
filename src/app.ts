import fs from "fs";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import path from "path";
import mime from "mime-types";
const app: Application = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/view-file/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), "uploads", filename);
  console.log(filePath);
  // Check file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const mimeType = getMimeType(filename);

  res.sendFile(filePath, {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": "inline", // Try to preview, not download
    },
  });
});

function getMimeType(filename: string): string {
  return mime.lookup(filename) || "application/octet-stream";
}

const test = async (req: Request, res: Response) => {
  const a = "Server is running";
  res.send(a);
};

app.get("/", test);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
