// loading env variables
const jwt = require("jsonwebtoken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.decode(token,"RESTFULAPIs");
        if (payload) {
          // store user data in request object
          req.user = payload;
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "header authentification mal formater " });
      }
    } else {
      res.status(400).json({ error: "pas d'authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

// MIDDLEWARE FOR PROVED AUTHORIZATION
const isProvedLoggedIn = async (req, res, next) => {
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const payload = await jwt.verify(token, "RESTFULAPIs");
        if (payload && payload.type === 'PROVED') {
          // store proved data in request object
          req.user = payload;
          next();
        } else {
          res.status(401).json({ error: "Token invalide pour les PROVED" });
        }
      } else {
        res.status(400).json({ error: "header authentification mal formater" });
      }
    } else {
      res.status(400).json({ error: "pas d'authorization header" });
    }
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

// export custom middleware
module.exports = {
  isLoggedIn,
  isProvedLoggedIn,
};