const fakeUser = {
  username : "Nicolas",
  loggedIn : false,
}
//로그인 로그아웃 매뉴 conditional위해 만든 가짜유저

export const trending = (req, res) => res.render("home", {pageTitle : "Home", fakeUser, });
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.render("edit");
export const search = (req, res) => {
  return res.send("Search");
}
export const deleteVideo = (req, res) => {
  return res.send(`Delete Video #${req.params.id}`)
}
export const upload = (req, res) => {
  return res.send("Upload Video");
}