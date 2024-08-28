'use strict'

const { cloudinary } = require("../config/cloundinary.config")

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

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles
}
