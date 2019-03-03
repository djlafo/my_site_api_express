const inProd = process.env.NODE_ENV === 'production';

module.exports = {
    jwtSecret: inProd ? process.env.JWT_SECRET : 'test token lol',
    production: {
        database: process.env.DB,
        username: process.env.DBUSER,
        password: process.env.DBPASS,
        host: process.env.DBHOST,
        port: process.env.DBPORT || 5432,
        dialect: 'postgres'
    },
    development: {
        database: 'MyDatabase',
        username: 'my_site_user',
        password: '12345',
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
};