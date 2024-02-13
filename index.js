const express = require('express');
const mongoose = require('mongoose');
const db_mongoose = require('./config/db_mongoose');
const bodyParser = require('body-parser');
const routes = require('./routers/route');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();



app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 30*60*1000 },
    resave: false,
    saveUninitialized: true
}));

mongoose.connect(db_mongoose.connection).then(() => {
    console.log('Conectado');
}).catch(() => {
    console.log('Erro de conexão com o banco de dados');
});


app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081");
});