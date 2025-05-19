const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  generatePassword: function (password) {
    return bcrypt.hashSync(password, saltRounds);
  },
  comparePassword: function (password, haspassword) {
    return bcrypt.compareSync(password, haspassword);
  },
  isLoggedIn: function (req, res, next) {
    if (req.session.user) {
      next()
    } else {
      res.redirect('/')
    }
  },
  formatDateToLocal: function (dt) {
    if (!dt) return '';
    const date = new Date(dt);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }
};
