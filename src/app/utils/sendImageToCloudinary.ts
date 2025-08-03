import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import multer from "multer";
import { UploadApiResponse } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        // fs.unlink(path, (err) => {
        //   if (err) {
        //     reject(err);
        //   }
        //   console.log("file is deleted");
        // });
      },
    );
  });
};

// Define the upload directory path
const uploadDir = path.join(process.cwd(), "uploads");

// Check if the folder exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // recursive ensures nested folders are created if needed
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Extract original extension including the dot, e.g., ".pdf"
    const ext = path.extname(file.originalname);
    // Save with fieldname + uniqueSuffix + original extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });

// import HttpStatus from "http-status";
// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import config from "../config";
// import multer, { StorageEngine } from "multer";
// import AppError from "../erros/AppError";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: config.cloudinary_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// // Upload to Cloudinary (buffer to base64)
// export const sendImageToCloudinary = (
//   fileBuffer: Buffer,
//   imageName: string,
//   mimetype: string,
// ): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     if (!fileBuffer)
//       throw new AppError(HttpStatus.NOT_FOUND, "Missing file buffer");
//     if (!mimetype) throw new AppError(HttpStatus.NOT_FOUND, "Missing mimetype");

//     // Convert to base64
//     const base64Image = fileBuffer.toString("base64");
//     const dataUri = `data:${mimetype};base64,${base64Image}`;

//     cloudinary.uploader.upload(
//       dataUri,
//       {
//         public_id: imageName,
//         resource_type: "image",
//         type: "upload",
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         if (!result) return reject(new Error("No result from Cloudinary"));
//         resolve(result);
//       },
//     );
//   });
// };

// // Multer memory storage
// const storage: StorageEngine = multer.memoryStorage();
// export const upload = multer({ storage });
