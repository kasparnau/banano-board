export const loggedIn = (req, res, next) => {
  if (req.user && req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send();
  }
};

export const notLoggedIn = (req, res, next) => {
  if (!req.user && !req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send();
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.roles?.find((x) => x === "admin")) {
    next();
  } else {
    return res.status(404).send();
  }
};
