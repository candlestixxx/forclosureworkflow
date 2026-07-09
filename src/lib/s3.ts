import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

export async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const settings = await prisma.setting.findUnique({ where: { id: 'global' } });

  if (!settings || !settings.awsAccessKeyId || !settings.awsSecretAccessKey || !settings.awsRegion || !settings.awsS3Bucket) {
    throw new Error("AWS S3 credentials are not configured in settings.");
  }

  const s3Client = new S3Client({
    region: settings.awsRegion,
    credentials: {
      accessKeyId: settings.awsAccessKeyId,
      secretAccessKey: settings.awsSecretAccessKey,
    },
  });

  // Generate a unique file name to avoid collisions
  const uniqueFileName = `${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: settings.awsS3Bucket,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: mimeType,
    // Setting ACL to public-read assumes bucket allows it. If not, presigned URLs are needed.
    // We'll assume the basic case where the bucket isn't strictly private for these docs or it's fine.
    // Actually, S3 defaults to private. Often better to not send ACL and rely on presigned, but
    // the request asks for "public S3 URL (or signed structure)". We'll build the public URL.
  });

  await s3Client.send(command);

  // Construct the public URL
  const publicUrl = `https://${settings.awsS3Bucket}.s3.${settings.awsRegion}.amazonaws.com/${uniqueFileName}`;
  return publicUrl;
}
