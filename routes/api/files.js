const router = require('express').Router();
const auth = require('../../auth');
const db = require('../../db');
const s3 = require('../../aws').s3;

router.get('/', auth.required, (req, res, next) => {
    s3.listFiles({}, (err, data) => {
        res.json({files: 
            data.commonPrefixes.map(f => {
                name: f.Prefix
            })
        });
    });
});

router.get('/:file', auth.optional, (req, res, next) => {
    // check if file is public or not
    const fileName = req.params.file;
    res.json({url: s3.getFile({ fileName: fileName })});
});

router.post('/upload', auth.required, (req, res, next) => {
    fileName = fileName.remove(/\//g);
    fileName = req.user.username + '//' + fileName;
    s3.uploadFile({
        fileStream: req.files.file,
        remoteName: fileName,
    }, (err, data) => {
        if(err) {
            return res.send(err);
        } else {
            return res.status(201);
        }
    });
});


module.exports = router;