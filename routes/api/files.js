const router = require('express').Router();
const auth = require('../../auth');
const db = require('../../db');
const s3 = require('../../aws').s3;

router.get('/', auth.required, (req, res, next) => {
    s3.listFiles({Prefix: req.user.username}, (err, data) => {
        res.json({files: 
            (data && data.Contents.map(f => {
                const split = f.Key.split('/');
                return {
                    name: split[split.length - 1],
                    path: f.Key,
                    date: f.LastModified.toLocaleDateString()
                };
            }) || [])
        });
    });
});

router.get('/:file', auth.optional, (req, res, next) => {
    const fileName = req.params.file;
    s3.listFiles({Prefix: fileName, MaxKeys: 2}, (err, data) => {
        if(data.Contents.length === 1) {
            // res.redirect("http" + (req.socket.encrypted ? "s" : "") + "://" + 
            //     req.headers.host + '/' + data.Contents[0].Key);
            res.redirect(s3.getFile({ fileName: data.Contents[0].Key }));
        } else {
            res.status(404).json({errors: {message: 'File not found'}});
        }
    });
});

router.post('/delete', auth.required, (req, res, next) => {
    const fileName = req.params.file;
    s3.deleteFile({ remoteName: fileName }, (err, data) => {
        if(err) {
            res.status(422).json({errors: {message: err.message}});
        } else {
            res.status(200).send({message: 'Deleted'});
        }
    });
});

router.post('/upload', auth.required, (req, res, next) => {
    let fileName = req.files.file.name;
    if(!fileName) return res.status(422).json({errors: {message: 'Missing File'}});
    fileName = fileName.replace(/[-\/]/g, '');
    fileName = `${req.user.username}-${Date.now()}-${fileName}`;
    s3.uploadFile({
        fileStream: req.files.file.data,
        remoteName: fileName,
    }, (err, data) => {
        if(err) {
            return res.status(422).json({errors: {message: err.message}});
        } else {
            return res.status(201).json({message: "success"});
        }
    });
});


module.exports = router;