const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

const inProd = process.env.NODE_ENV === 'production';

const db = require('./db');
db.sequelize.authenticate().then(function() {
    console.log('[SUCCESS] Database Connection');

    require('./models');
    require('./auth/passport');

    const cors = require('cors');
    app.use(cors());
  

    app.get('/', (req, res) => {
        db.sequelize.query('SELECT NOW()', {type: db.sequelize.QueryTypes.SELECT})
            .then(dbres => {
                res.send(dbres);
            });
    });

    app.use(require('./routes'));

    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });  

    if (!inProd) {
        app.use((err, req, res, next) => {
            console.log(err.stack);
        
            res.status(err.status || 500);
        
            res.json({'errors': {
                message: err.message,
                error: err
            }});
        });
    }

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({'errors': {
            message: err.message,
            error: {}
        }});
    });

    const port = 3001;
    app.listen(port, () => console.log(`App is now listening on port ${port}`));
});