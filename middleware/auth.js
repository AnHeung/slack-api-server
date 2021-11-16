const {errMsg} = require('../errorHandle')
module.exports = (req, res, next) => {
  try {    
    const authKey = req.headers[process.env.API_KEY];
    console.error(` 결과값 : ${JSON.stringify(req.headers)}`)
    if (!authKey || authKey !== process.env.API_KEY_VALUE) {
      throw 'not matched key';
    } else {
      next();
    }
  } catch (e) {
    res.status(401).json(errMsg(e));
  }
};