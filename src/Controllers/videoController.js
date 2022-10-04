const fakeUser = {
  username : "Nicolas",
  loggedIn : false,
}

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