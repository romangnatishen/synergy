( async () => {

    require('dotenv').config();
    const sequelize = require('./core/db_conn');
    console.log('Initializing SQL server ...');

    sequelize
    .authenticate()
    .then(() => {
        require('./core/entity_sync')();
        console.log('Connection to database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

    const bg_tasks = require('./modules/bg_tasks');    
    await bg_tasks.kanbanStatistics().catch((err) =>{
        console.log(err);
        });

})()