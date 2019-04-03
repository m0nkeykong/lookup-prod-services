var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    db = require('./database'),
    UserController = require('./controllers/UserController'),
    TrackController = require('./controllers/TrackController'),
    PointController = require('./controllers/PointController'),
    cors = require('cors'),
    port = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.set('port', port);

//  refers root to API file
app.use('/', express.static('./public'));
app.use('/assets', express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
    next();
});

app.use(cors());
app.use('/user', UserController);
// app.use('/track', TrackController);
// app.use('/point', PointController);

app.all('*', (req, res, next) => {
    res.status(404).send({ "Message": `This page was not found` });
});

// app.post('/login', userController.insertUser);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
