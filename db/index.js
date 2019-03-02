const inProd = process.env.NODE_ENV === 'production';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('MyDatabase', 'my_site_user', '12345', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => {
        console.log('[SUCCESS] Database Connection');
    }).catch(err => {
        console.error('[FAILED] Database Connection: ', err);
    });

// const expressSession = require('express-session');
// const sessionStore = require('express-session-sequelize')(expressSession.Store);
// const session = expressSession({
//     resave: false,
//     saveUninitialized: false,
//     rolling: true,
//     secret: inProd ? process.env.COOKIE_SECRET : 'test secret',
//     cookie: {
//         maxAge: 600000,
//         secure: inProd
//     },
//     store: new sessionStore({db: sequelize})
// });

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};