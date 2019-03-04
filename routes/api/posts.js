const router = require('express').Router();
const auth = require('../../auth');
const db = require('../../db');

router.get('/', (req, res, next) => {
    db.sequelize.models.Posts.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 15,
        include:[{
            model: db.sequelize.models.Users,
            required: true,
            include: [{
                model: db.sequelize.models.Roles,
                required: true
            }]
        }]
    }).then(rows => {
        const serialized = db.sequelize.models.Posts.serializePosts(rows);
        return res.send(serialized);
    });
});

router.get('/:id', (req, res, next) => {
    db.sequelize.models.Posts.find({
        where: {
            id: Number(req.params.id)
        },
        include:[{
            model: db.sequelize.models.Users,
            required: true,
            include: [{
                model: db.sequelize.models.Roles,
                required: true
            }]
        }]
    }).then(val => {
        res.send(val.serialize());
    });
});

router.post('/', auth.required, (req, res, next) => {
    if(!req.body.post || !req.body.post.title || !req.body.post.body) {
        return res.status(422).json({errors: {message: 'title or body is invalid'}});
    }
    const newPost = db.sequelize.models.Posts.create({
        title: req.body.post.title,
        body: req.body.post.body,
        user: req.user.id
    }).then(post => {
        return res.json(post.serialize());
    });
});

router.post('/delete', auth.required, (req, res, next) => {
    if(!req.body.id) {
        return res.status(422).json({errors: {message: 'Missing ID'}});
    }
    db.sequelize.models.Posts.destroy({
        where: {
            id: req.body.id
        }
    }).then(() => {
        return res.status(290).json({success: true});
    });
});

module.exports = router;