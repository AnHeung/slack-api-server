const {errMsg} = require('../errorHandle')
module.exports = async (req, res, next) => {
  try {    
    const authKey = req.headers[process.env.API_KEY];
    if (!authKey || authKey !== process.env.API_KEY_VALUE) {
      throw 'not matched key';
    } else {
      next();
    }
  } catch (e) {
    res.status(401).json(errMsg(e));
  }
};