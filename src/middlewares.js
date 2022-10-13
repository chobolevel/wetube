export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
}
//로그인하지 않은 사용자의 접근을 허용하지 않는 미들웨어
export const protectorMiddleware = (req, res, next) => {
  if(req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
}
//로그인한 사용자만 접근할 수 없도록 하는 미들웨어
export const publicOnlyMiddleware = (req, res, next) => {
  if(!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
}