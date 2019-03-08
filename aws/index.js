const AWS = require('aws-sdk');
let options = {region: 'us-east-2'};
if(inProd) {
    options.accessKeyId = process.env.ACCESS_KEY_ID;
    options.secretAccessKey = process.env.SECRET_ACCESS_KEY;
}
const config = new AWS.config(options);
const S3 = new AWS.S3({
    params: {
        Bucket: 'personal-api'
    }
});

const listFiles = function({ delimiter }, callback) {
    S3.listObjects({

    }, callback);
};

const getFile = function({ fileName, expires = 10}) {
    return S3.getSignedUrl('getObject', {
        Key: fileName,
        Expires: expires
    });
};

const uploadFile = function({ fileStream, remoteName }, callback) {
    S3.upload({
        Body: fileStream,
        Key: remoteName
    }, callback);
};

const deleteFile = function({ remoteName }, callback) {
    S3.deleteObject({
        Key: remoteName
    }, callback);
}

const deleteFiles = function({ remoteNameArray }, callback) {
    const formatted = remoteNameArray.map((item) => {Key: item});
    S3.deleteObjects({
        Delete: {
            Objects: formatted
        }
    }, callback);
}

module.exports = {
    s3: {
        listFiles: listFiles,
        getFile: getFile,
        uploadFile: uploadFile,
        deleteFile: deleteFile,
        deleteFiles: deleteFiles
    }
};