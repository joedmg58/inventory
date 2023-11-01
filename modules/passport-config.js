const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {

    const authenticateUser = (email, password, done) => {
        
        getUserByEmail(email, async (error, user) => {
            if (user == null) {
                return done(null, false, {message: 'No user with that email.'});
            }

            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Password incorrect'})
                }
            } catch (error) {
                return done(error);
            }
        });


    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser( (user, done) => done(null, user.id));
    passport.deserializeUser( (id, done) => {
        getUserById(id, (error, user) => {
            return done(error, user);
        })
    });
}

module.exports = initialize;