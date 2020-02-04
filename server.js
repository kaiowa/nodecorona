var express=require('express'),
  path = require('path'),
  pug = require('pug'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  api=require('./backend/api');
  
  
var app=new express();
app.use(cookieParser());
app.use(session({ resave:true,saveUninitialized:true,secret: 'wotofack!&7U', cookie: {maxAge: 365 * 24 * 60 * 60 * 1000} }));
app.use(bodyParser.urlencoded({ extended: true,limit:'100mb' }))
app.use(bodyParser.json({limit: '100mb', extended: true}))

app.set('views', path.join(__dirname, 'layout_views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/api',api);

app.get('/',function(req,res){
  res.render('corona');
});

var server=app.listen(5000,function(){
  console.log('server running in 5000');
});