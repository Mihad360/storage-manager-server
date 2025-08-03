/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import path from "path";
const app: Application = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get('/view-file/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  res.sendFile(filePath, {
    headers: {
      'Content-Type': getMimeType(filename),
      'Content-Disposition': 'inline',
    },
  });
});

function getMimeType(filename: string): string {
  if (filename.endsWith('.pdf')) return 'application/pdf';
  if (filename.endsWith('.txt') || filename.endsWith('.note')) return 'text/plain';
  if (filename.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}


// const test = async (req: Request, res: Response) => {
//   const a = 10;
//   res.send(a);
// };

// app.get("/", test);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
