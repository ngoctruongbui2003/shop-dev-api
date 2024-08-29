'use strict'

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { cloudinary, image } = require("../config/cloundinary.config")
const { s3, PutObjectCommand } = require("../config/s3.config")
const crypto = require('crypto')

const { GetObjectCommand } = require("@aws-sdk/client-s3");

// 1. upload from url image
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://bizweb.dktcdn.net/thumb/1024x1024/100/427/145/products/the-monsters-fall-in-wild-labubu-size-40cm-2.jpg?v=1724056595287'
        const folderName = 'product/0001'
        const newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(urlImage, {
            folder: folderName,
            public_id: newFileName
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}

// 2. upload form local image
const uploadImageFromLocal = async ({
    path,
    folderName = 'product/0001'
}) => {
    try {
        // const path = 'path/to/local/image'
        const newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
            public_id: newFileName
        });

        return {
            url: result.secure_url,
            shopId: 1,
            thumb_url: await cloudinary.url(result.public_id, {
                width: 100,
                height: 100,
                crop: "fill",
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error(error);
    }
}

// 3. upload image form local with multiple files
const uploadImageFromLocalFiles = async ({
    files,
    folderName = 'product/0001'
}) => {
    try {
        if (!files) return;

        const uploadUrls = [];
        for (const file of files) {
            const newFileName = 'testdemo'

            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
                public_id: newFileName
            });

            uploadUrls.push({
                image_url: result.secure_url,
                shopId: 1,
                thum_url: await cloudinary.url(result.public_id, {
                    width: 100,
                    height: 100,
                    crop: "fill",
                    format: 'jpg'
                })
            });
        }

        return uploadUrls

    } catch (error) {
        console.error(error);
    }
}

// ------- Amazon Web Service S3 -------
// 4. Upload from image local
const uploadImageFromLocalS3 = async ({
    file
}) => {
    try {
        const randomImageName = () => crypto.randomBytes(16).toString('hex');
        const imageName = randomImageName(); 

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName, // name of image
            Body: file.buffer, // Buffer of file
            ContentType: 'image/jpeg', // that is what you need!
        });
        const result = await s3.send(command);

        console.log(result);
        

        // const singledUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName, // name of image
        // })
        // export url by s3-request-presigner
        // const url = await getSignedUrl(s3, singledUrl, { expiresIn: 3600 });

        const url = `${process.env.AWS_DISTRIBUTE_DOMAIN_NAME}/${imageName}`
        // export url by cloudfront-signer
        const signedUrl  = await getSignedUrl({
            url,
            keyPairId: process.env.AWS_CLOUDFRONT_PUBLIC_KEY_ID,
            dateLessThan: new Date(Date.now() + 3 * 60 * 60 * 60 * 1000), // 3 days
            privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY_ID,
        });

        console.log(signedUrl);
        return {
            url,
            result: result,
        }

    } catch (error) {
        console.error(`Error uploading image use S3Client: ${error}`);
        
    }
}


module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalS3
}
