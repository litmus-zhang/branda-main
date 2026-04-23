import { CreateBucketCommand, DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, HeadBucketCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { config } from "../config.js"

export const s3 = new S3Client({
  endpoint: config.S3_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

/**
 * Checks if an S3/MinIO bucket exists and is accessible
 */
export async function bucketExists(
  s3: S3Client,
  bucketName: string = config.S3_ACCESS_KEY_ID,
): Promise<boolean> {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }))
    return true
  }
  catch (error: any) {
    // Bucket does not exist OR no access
    if (
      error?.$metadata?.httpStatusCode === 404
      || error?.name === "NotFound"
      || error?.Code === "NoSuchBucket"
    ) {
      return false
    }

    // Access denied → bucket exists but you cannot access it
    if (
      error?.$metadata?.httpStatusCode === 403
      || error?.name === "Forbidden"
    ) {
      return true
    }

    throw error
  }
}

export async function generatePresignedUrl({ key, type }: { key: string, type: string }) {
  try {
    const fileName = key.split("/").pop()

    // Validate inputs
    if (!fileName || !type) {
      return { error: "fileName and fileType are required" }
    }

    // check if bucket exist, if not create it,
    const bucketExist = await bucketExists(s3, config.S3_BUCKET_NAME)
    if (!bucketExist) {
      await s3.send(
        new CreateBucketCommand({
          Bucket: config.S3_BUCKET_NAME,
        }),
      )
    }
    console.log({ bucketExist })

    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: `${key}`,
      ContentType: type,
      // ACL: "bucket-owner-full-control",
    })

    // Generate presigned URL (valid for 60 seconds)
    const url = await getSignedUrl(s3, command, { expiresIn: 60 })

    return { uploadUrl: url, message: "Presigned URL generated successfully" }
  }
  catch (error) {
    console.error(error)
    return { error: "Failed to generate presigned URL" }
  }
}

export async function deleteFileFromS3(fileName: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: fileName,
    })

    // Delete the file from S3
    await s3.send(command)

    return { message: "File deleted successfully" }
  }
  catch (error) {
    console.error(error)
    return { error: "Failed to delete file from S3" }
  }
}

export async function getFileFromS3(fileName: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: fileName,
    })

    // Get the file from S3
    const response = await s3.send(command)

    return { message: "File retrieved successfully", data: response }
  }
  catch (error) {
    console.error(error)
    return { error: "Failed to retrieve file from S3" }
  }
}

export async function deleteFolder(bucket: any, prefix: any) {
  let listedObjects
  do {
    listedObjects = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }),
    )

    if (!listedObjects.Contents || listedObjects.Contents.length === 0)
      break

    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    }

    await s3.send(new DeleteObjectsCommand(deleteParams))
  } while (listedObjects.IsTruncated)
}
export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: config.S3_BUCKET_NAME,
    Key: key,
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 }) // 1 hour
}

export async function uploadFileToS3(file: File, key: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    })

    // Upload the file to S3
    await s3.send(command)

    return { message: "File uploaded successfully" }
  }
  catch (error) {
    console.error(error)
    return { error: "Failed to upload file to S3" }
  }
}
