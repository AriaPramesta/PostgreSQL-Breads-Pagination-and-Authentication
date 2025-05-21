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
  formatDateTime: function (date) {
    if (!date) return '';
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
};
