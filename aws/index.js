const AWS = require('aws-sdk');
let options = {region: 'us-east-2'};
options.Bucket = 'personal-api';

const S3 = new AWS.S3({
    params: options
});

const listFiles = function({ delimiter, MaxKeys, Prefix }, callback) {
    S3.listObjects({
        Delimiter: delimiter,
        Prefix: Prefix,
        MaxKeys: MaxKeys
    }, callback);
};

const getFile = function({ fileName, expires = 10}) {
    return S3.getSignedUrl('getObject', {
        Key: fileName,
        Expires: expires
    });
};

const uploadFile = function({ fileStream, remoteName }, callback) {
    let ContentType = '';
    if(['.png', '.jpg', 'jpeg', '.bmp', '.gif'].some(imageFormat => {
        return remoteName.endsWith(imageFormat);
    })) {
        ContentType = 'image/png';
    } else if (remoteName.endsWith('pdf')) {
        ContentType = "application/pdf";
    }
    S3.upload({
        Body: fileStream,
        Key: remoteName,
        ContentDisposition: 'inline',
        ContentType: ContentType
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