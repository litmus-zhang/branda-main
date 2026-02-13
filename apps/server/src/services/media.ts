// This service handles all non-text content. When a user uploads an image, it creates multiple versions (thumbnail, medium, large), applies compression, and potentially runs content moderation. For videos, it triggers transcoding pipelines to create multiple quality versions and generates preview thumbnails. All media is served through CDN with appropriate cache headers.

// upload file to s3, create multiple versions (thumbnail, medium, large) for images
// compress images
// run content moderation
// serve images through CDN with cache headers

// for videos, trigger transcoding pipelines to create multiple quality versions
// generate preview thumbnails
// serve videos through CDN with cache headers

// The CDN to use is cloudinary CDN
import { v2 as cloudinary } from "cloudinary"
import sharp from "sharp"
import { config } from "../config.js"
import { uploadFileToS3 } from "./s3.js"

export class MediaService {
  //   private cloudinary: typeof cloudinary

  //   constructor() {
  //     this.cloudinary = cloudinary.config({
  //       cloud_name: config.CLOUDINARY_CLOUD_NAME,
  //       api_key: config.CLOUDINARY_API_KEY,
  //       api_secret: config.CLOUDINARY_API_SECRET,
  //       secure: true,
  //       shorten: true,
  //     })
  //   }

  //   async uploadFile(file: File, mimetype: string) {
  //     // ... existing comment about CDN ...
  //     const fileKey = `${file.name}-${Date.now()}`

  //     // Upload original to S3
  //     await uploadFileToS3(file, fileKey)

  //     // Process based on media type
  //     if (mimetype.startsWith("image/")) {
  //       return this.processImage(file, fileKey)
  //     }
  //     if (mimetype.startsWith("video/")) {
  //       return this.processVideo(file, fileKey)
  //     }

  //     throw new Error("Unsupported media type")
  //   }

  //   private async processImage(file: File, fileKey: string) {
  //     // Create multiple versions
  //     const [thumbnail, medium, large] = await Promise.all([
  //       sharp(await file.arrayBuffer()).resize(200, 200).toBuffer(),
  //       sharp(await file.arrayBuffer()).resize(800, 600).toBuffer(),
  //       sharp(await file.arrayBuffer()).resize(1920, 1080).toBuffer(),
  //     ])

  //     // Upload versions to CDN
  //     const uploadOptions = {
  //       resource_type: "image" as const,
  //       quality: "auto",
  //       public_id: fileKey,
  //     }

  //     const [originalUrl, thumbUrl, mediumUrl, largeUrl] = await Promise.all([
  //       this.cloudinary.uploader.upload(URL.createObjectURL(file), uploadOptions),
  //       this.cloudinary.uploader.upload(URL.createObjectURL(thumbnail), uploadOptions),
  //       this.cloudinary.uploader.upload(URL.createObjectURL(medium), uploadOptions),
  //       this.cloudinary.uploader.upload(URL.createObjectURL(large), uploadOptions),
  //     ])

  //     return {
  //       original: this.addCacheHeaders(originalUrl.secure_url),
  //       thumbnail: this.addCacheHeaders(thumbUrl.secure_url),
  //       medium: this.addCacheHeaders(mediumUrl.secure_url),
  //       large: this.addCacheHeaders(largeUrl.secure_url),
  //     }
  //   }

  //   private addCacheHeaders(url: string) {
  //     return {
  //       url,
  //       headers: {
  //         "Cache-Control": "public, max-age=31536000",
  //         "CDN-Cache-Control": "public, max-age=31536000",
  //       },
  //     }
  //   }

  //   // Video processing stubs
  //   private async processVideo(file: File, fileKey: string) {
  //     // Implementation for video transcoding pipelines
  //     // Would typically involve queueing for background processing
  //     return {
  //       original: this.addCacheHeaders(await this.uploadVideoFile(await file.arrayBuffer(), fileKey)),
  //       resolutions: {
  //         "1080p": "",
  //         "720p": "",
  //         "480p": "",
  //         "360": "",
  //       },
  //     }
  //   }

  //   private async uploadVideoFile(file: ArrayBuffer, fileKey: string) {
  //     // Similar upload logic as images but for videos
  //     const upload = await this.cloudinary.uploader.upload(`data:video/mp4;base64,${Buffer.from(file).toString("base64")}`, {
  //       resource_type: "video",
  //       public_id: fileKey,
  //     })
  //     return upload.secure_url
  //   }
}

export const mediaService = new MediaService()
