import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", {
    pageTitle: "Join",
  });
}
//Join
export const postJoin = async (req, res) => {
  const pageTitle = "Join"
  const { name, email, username, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match."
    });
  }
  const usernameExists = await User.exists({ $or: [{ username }, { email }] });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username or email is already taken."
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    })
  }
  return res.redirect("/login");
}
export const edit = (req, res) => {
  res.send("Edit User");
}
export const remove = (req, res) => {
  res.send("Remove Users");
}
//Login
export const getLogin = (req, res) => {
  res.render("login", {pageTitle : "Login"});
}
export const postLogin = async (req, res) => {
  const pageTitle = "Login"
  const { username, password } = req.body;
  const user = await User.findOne({username});
  //계정이 존재하는 지 확인
  if(!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage : "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage : "Wrong Password.",
    });
  }
  console.log("LOG USER IN! COMING SOON!");
  res.redirect("/");
}
export const logout = (req, res) => {
  res.send("Log out");
}
export const see = (req, res) => {
  res.send("See User");
}