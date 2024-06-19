const User = require('../models/user');

//register form
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}
//submit registration
module.exports.registerSubmit = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to BarkPark!');
            res.redirect('/parks');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
//login form
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}
//login submit
module.exports.loginSubmit = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/parks';
    res.redirect(redirectUrl);
}
//logout
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/parks');
    });
}