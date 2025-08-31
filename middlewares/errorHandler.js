// npm i express-async-handler
const errorHandler = (error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error.ejs', {title: 'Error', error: error.message, user: req.user});
};

module.exports = errorHandler;