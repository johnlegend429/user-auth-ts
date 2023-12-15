import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import appRoutes from './routes';
import mongoose from 'mongoose';

// Initialize the application
const app = express();

// Set up body parser, cookie parser, and session middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies using qs library
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize passport and the passport session middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(appRoutes);

// Connect to the Mongo database
mongoose.connect('mongodb://127.0.0.1:27017/edeal').then(() => console.log("DB Connected"));

// Start the server
app.listen(8080, () => {
    console.log('server is running')
});