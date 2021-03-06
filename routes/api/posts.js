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

router.post('/', auth.required, (req, res, next) => {
    if(!req.body.post || !req.body.post.title || !req.body.post.body) {
        return res.status(422).json({errors: {message: 'title or body is invalid'}});
    }
    const newPost = db.sequelize.models.Posts.create({
        title: req.body.post.title,
        body: req.body.post.body,
        user: req.user.id
    }).then(post => {
        db.sequelize.models.Posts.getFullPost(post.id).then(joinedPost => {
            return res.json(db.sequelize.models.Posts.serialize(joinedPost));
        });
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

router.get('/:id', (req, res, next) => {
    db.sequelize.models.Posts.getFullPost(req.params.id).then(val => {
        if(val) {
            res.send(db.sequelize.models.Posts.serialize(val));
        } else {
            res.status(404).json({errors: {message: 'Not found'}});
        }
    });
});


router.post('/:id', auth.required, (req, res, next) => {
    if(!req.body.body || !req.body.title) {
        return res.status(422).json({errors: {message: 'Missing body or title'}});
    }
    db.sequelize.models.Posts.update(
        {
            body: req.body.body,
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(() => {
        return res.status(200).json({success: true});
    });
});

module.exports = router;