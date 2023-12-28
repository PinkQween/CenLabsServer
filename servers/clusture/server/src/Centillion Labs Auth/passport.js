const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

module.exports = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)

        if (user == null) {
            return done(null, false, { message: 'User not found' })
        }

        try {
            if (await bcrypt.compare(password, user.multilayerHashedPassword)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}