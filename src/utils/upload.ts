import fs from 'fs';
import AWS from 'aws-sdk';
import formidable, { File } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid'; // for unique filenames

const s3Client = new AWS.S3({
    endpoint: process.env.DO_SPACED_URL,
    region: "Ion1",
    credentials: {
        accessKeyId: process.env.DO_SPACED_ID as string,
        secretAccessKey: process.env.DO_SPACES_SECRET as string
    }
});

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = formidable();

    form.parse(req, async (err, fields, files: { fileForUpload?: File[] }) => {
        if (!files.fileForUpload || files.fileForUpload.length === 0) {
            res.status(400).send("No files to upload");
            return;
        }

        try {
            const folderName = "uploads/"; // specify the desired folder path
            const bucketName = process.env.DO_SPACES_BUCKET as string;
            const baseUrl = `${process.env.DO_SPACED_URL}/${bucketName}`; // base URL for the files

            // Map over each file, upload it to S3, and collect the URLs
            const uploadPromises = files.fileForUpload.map(async file => {
                const filename = file.originalFilename ? file.originalFilename : `file_${uuidv4()}`;
                const fileKey = `${folderName}${filename}`;

                // Upload the file
                await s3Client.putObject({
                    Bucket: bucketName,
                    Key: fileKey,
                    Body: fs.createReadStream(file.filepath),
                    ACL: "public-read"
                }).promise();

                // Construct and return the URL for the uploaded file
                return `${baseUrl}/${fileKey}`;
            });

            // Resolve all upload promises and get URLs
            const fileUrls = await Promise.all(uploadPromises);

            res.status(201).json({
                message: "Files uploaded successfully",
                fileUrls: fileUrls // URLs for accessing the uploaded files
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("File upload failed");
        }
    });
}
