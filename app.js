const express = require('express');
const app = express();

const inProd = process.env.NODE_ENV === 'production';

const { Pool } = require('pg');
const pool = new Pool({
    database: 'MyDatabase',
    host: 'localhost',
    port: 5432,
    user: 'my_site_user',
    password: '12345'
});

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
app.use(session({
    resave: false,
    saveUninitialized: false,
    rolling: true,
    secret: inProd ? process.env.COOKIE_SECRET : 'test secret',
    cookie: {
        maxAge: 600000,
        secure: inProd
    },
    store: new pgSession({pool: pool})
}));

app.get('/', (req, res) => {
    pool.query('SELECT NOW()', (err, dbres) => {
        res.send(dbres);
    });
});

const port = 3001;
app.listen(port, () => console.log(`App is now listening on port ${port}`));