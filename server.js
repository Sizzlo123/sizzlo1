require('dotenv').config()

const express=require('express')
const app=express();
// const ejs_lint=require('ejs-lint')
const ejs=require('ejs');
const expressLayout=require('express-ejs-layouts')
const path=require('path');
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const MongodbStore=require('connect-mongo')
const passport=require('passport')
const { env } = require('process');
const { minify } = require('laravel-mix');
const { connect } = require('http2');
const Emitter=require('events')
const PORT=process.env.PORT || 3000

//database connection
const url='mongodb://localhost/Sizzlo';

mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true});

const connection=mongoose.connection;

connection.once('open',()=>{
    console.log('Database connected...');
}) .on('error', function (err) {
    console.log('connection failed...');
});



let store = new MongodbStore({
    mongoUrl: url,
    collection: "sessions"
 });

 //Event emitter

 const eventEmitter = new Emitter()
 app.set('eventEmitter', eventEmitter)

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: store,
    saveUninitialized: false,
    // cookie: { maxAge: 1000 * 60},
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
}));


//passport config
const passportInit= require('./app/config/passport');
const { Socket } = require('socket.io');
const order = require('./app/models/order');
// const user = require('./app/models/user');
// const { use } = require('passport');
// passportInit(
//     passport,
//     email=> user.find(user=>user.email === email) ,
//     id=> user.find(user=> user.id === id)
// )

passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
app.use(express.json()) 
// app.get('/public', express.static('public'));

//session store
// const user = require('./app/models/user');
// app.use((req,res,next)=>{
//     res.locals.session=req.session
//     res.locals.user=user
//     next()
// })



app.use(express.static(__dirname));
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));   


// require('./routes/web')(app)
//session store
// const user = require('./app/models/user');
// app.use((req,res,next)=>{
//     res.locals.session=req.session
//     res.locals.user=user
//     next()
// })
// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)

const server= app.listen(PORT,()=> {
    console.log(`Listening on port ${PORT}`)
})

// Socket

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    console.log(data)
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})



// app.get("/login", (req, res) => {
//     console.log(__dirname)
// });