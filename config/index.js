module.exports = {
    env: 'DEV',
    jwtSecret: 'TOKEN_SECRET_VAR',
    production: {
        database: "DB_VAR",
        username: "DBUSER_VAR",
        password: "DBPASS_VAR",
        host: "DBHOST_VAR",
        port: "DBPORT_VAR",
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