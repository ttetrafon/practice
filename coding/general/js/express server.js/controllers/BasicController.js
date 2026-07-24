module.exports = {
  index: (req, res) => {
    res.send('This is the home page');
  },
  credits: (req, res) => {
    res.send('This is the credits page');
  },
};
