import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import multer from "multer";
import { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// Cloudinary upload using file buffer (works in Vercel)
export const sendImageToCloudinary = (
  fileName: string,
  fileBuffer: Buffer,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject(new Error("Missing file buffer"));

    const newFileName = fileName?.split(".")[0];
    const fileExt = fileName?.split('.').pop();
    const base64 = fileBuffer.toString("base64");
    const dataUri = `data:application/octet-stream;base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        public_id: newFileName,
        resource_type: "raw",
        use_filename: true,
        unique_filename: false,
        format: fileExt,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      },
    );
  });
};

// ✅ Use memory storage (required in Vercel)
const storage = multer.memoryStorage();
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

// import { v2 as cloudinary } from "cloudinary";
// import multer from "multer";
// import streamifier from "streamifier";
// import { UploadApiResponse } from "cloudinary";
// import config from "../config";
// import path from "path";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: config.cloudinary_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// // Memory storage (no local disk save)
// const storage = multer.memoryStorage();
// export const upload = multer({ storage });

// // Upload buffer to Cloudinary with extension
// export const sendImageToCloudinary = (
//   originalName: string, // from file.originalname
//   buffer: Buffer
// ): Promise<Record<string, unknown>> => {
//   return new Promise((resolve, reject) => {
//     const ext = path.extname(originalName); // e.g., '.pdf'
//     const baseName = path.basename(originalName, ext); // e.g., 'resume'

//     const uniqueName = `${baseName}-${Date.now()}${ext}`; // resume-169XXXX.pdf

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         public_id: uniqueName,
//         resource_type: "raw", // or 'image' or 'auto'
//       },
//       function (error, result) {
//         if (error) return reject(error);
//         resolve(result as UploadApiResponse);
//       }
//     );

//     streamifier.createReadStream(buffer).pipe(uploadStream);
//   });
// };
