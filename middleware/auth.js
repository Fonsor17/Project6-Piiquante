// Package required for authentication token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Recovering the token in th authorization header by extracting the content after "Bearer"
    const token = req.headers.authorization.split(' ')[1];
    //Decoding the token. If the token is not valid, this will throw an error.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Extracting the user ID from the token
    const userId = decodedToken.userId;
    req.auth = { userId };
    //Check if the userID in the request is the same of the one in the token.If not throw an error
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
    //If the comparison went well, the user is authenticated and execution is passed along
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};