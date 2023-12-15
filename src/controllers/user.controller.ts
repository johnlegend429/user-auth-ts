import passport from 'passport';
import userModel from '../models/user.model';
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local'

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    async function (email, password, done) {
        const data = await userModel.findOne({ email: email });
        if (!!data) {
            bcrypt.compare(password, data.password, function (err, res) {
                if (res) {
                    return done(null, data);
                } else {
                    return done('Incorrect password')
                }
            })
        } else {
            return done('Incorrect email')
        }
    }
));

// Set up passport serialization and deserialization
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    const user = await userModel.findById(id);
    done(null, user);
});

export const doLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
})

export const doRegister = async (req, res) => {
    const { email, password } = req.body;
    // check if all fields are not empty
    if (!email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        // check if user is already registered
        let user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // encrypt password before saving to database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user object and save to database
        user = new userModel({ email: email, password: hashedPassword });
        await user.save();

        // send success response
        res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
}
