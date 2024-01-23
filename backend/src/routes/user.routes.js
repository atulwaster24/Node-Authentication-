import express from 'express';
import UserController from '../controllers/user.controller.js';
import { jwtVerify } from '../middleware/auth.middleware.js';
import passport from 'passport';

export const userRouter = express.Router();


const userController = new UserController();


// GET Routes
userRouter.route('/login').get((req, res, next)=>{
    res.render('login', {title: "Sign In", isLogged: null, msg: null});
})

userRouter.route('/register').get((req, res, next)=>{
    if(req.session.token){
        const token = jwtVerify(req.session.token);
        const username = token.payload.user.username;
        let dataToRender = {title: 'Register', isLogged: true, user: username, msg: 'You are already logged in. Log out before creating a new account.'}
        return res.render('register', dataToRender)}
    res.render('register', {title: 'Sign Up', isLogged: null, msg: null});
})


userRouter.route('/logout').get((req,res,next)=>{
    if(req.isAuthenticated()){
        req.logOut(()=>{
            res.redirect('/')
        })
        res.clearCookie('connect.sid');
        return
    }
    userController.logout(req,res, next);
})


userRouter.route('/auth/google').get(passport.authenticate('google',{scope: ['profile', 'email']}));

userRouter.route('/auth/google/secrets').get(passport.authenticate('google', {failureRedirect: '/'}), (req, res)=>{
    res.render('home',{title: "Home", isLogged: true, user: req.user, msg: null});
})

userRouter.route('/profile/:username').get((req,res)=>{
    console.log(req)
    if(req.isAuthenticated()){
        res.render('details', {title: 'Account', isLogged: true, user: req.user, msg: null});
    }
})

//Post Routes
userRouter.route('/login').post((req, res, next)=>{
    userController.login(req, res, next);
});


userRouter.route('/register').post((req, res,next)=>{
    userController.register(req, res,next)
});
