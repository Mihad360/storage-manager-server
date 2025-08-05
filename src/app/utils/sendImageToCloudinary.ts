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