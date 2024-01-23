import path from'path';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectToDB } from './backend/config/database.js';
import { userRouter } from './backend/src/routes/user.routes.js';
import expressEjsLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {LocalLogin, GoogleLogin} from './backend/config/passport-authentications.js';
import passport from 'passport';
import { jwtVerify } from './backend/src/middleware/auth.middleware.js';


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve('backend', 'src', 'views')));
app.use(expressEjsLayouts);
app.use(cookieParser());
app.use(express.static(path.join(path.resolve('backend', 'src', 'public'))));
app.use(session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session())

app.use(express.urlencoded({extended:true}));


app.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        return res.render('home',{title: 'Home', isLogged: true, user: req.user, msg: null})
    }
    if(req.session.token){
        const token = jwtVerify(req.session.token);
        const username = token.payload.user.username;
        let dataToRender = {title: 'Home', isLogged: true, user: username}
        return res.render('home', dataToRender)}
    res.render('home', {title: "Home", isLogged: null, msg: null});
});

app.use('/user', userRouter);








app.listen('1000',()=>{
    console.log('\nServer listening at Port:', 1000);
    connectToDB();
})