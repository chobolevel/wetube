import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
//프로필 수정 컨트롤러
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
}
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  file ? console.log(file.path) : null;
  //위처럼 작성하면 req로부터 다양하게 받을 수 있음
  const findUsername = await User.findOne({ username });
  const findUserEmail = await User.findOne({ email });
  //중복되는 객체를 가져온 후 생성 아이디를 비교하여 다를 경우에만 오류를 전송함
  if (findUsername.id !== _id && findUserEmail.id !== _id) {
    return res
      .status(400)
      .render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "This email or Username is already taken.",
      })
  }
  const updatedUser = await User.findByIdAndUpdate(_id, {
    avatarUrl: file ? file.path : avatarUrl,
    name,
    email,
    username,
    location
  }, { new: true });
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
}
//로그인 컨트롤러
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
}
export const postLogin = async (req, res) => {
  const pageTitle = "Login"
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  //계정이 존재하는 지 확인
  //소셜 로그인을 한 경우 password를 이용한 로그인 차단
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    //비밀번호가 틀린 경우
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}
//로그아웃 컨트롤러
export const logout = (req, res) => {
  req.flash("info", "Bye Bye");
  req.session.destroy();
  return res.redirect("/");
}
//깃허브를 이요한 로그인 컨트롤러
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    }
  })).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    //API로부터 정보 받아옴
    const userData = await
      (await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        }
      })).json();
    const emailData = await
      (await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        }
      })).json();
    const emailObj = emailData.find(email => email.primary === true && email.verified === true);
    if (!emailObj) {
      //이메일을 받아오지 못한 경우 LOGIN페이지로 보냄
      return res.redirect("/login");
    }
    //해당 이메일로 이미 계정이 있으면 로그인 하도록 만듦
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //여기는 Github이메일로 생성된 아이디가 없는 경우 새로운 계정을 생성함 비밀번호가 없는 아이디로
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        email: emailObj.email,
        username: userData.login,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    //만약 토큰을 못받았다면 LOGIN화면으로 보내짐
    return res.status(400).redirect("/login");
  }
}
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
    //깃허브 로그인의 경우 비밀번호가 존재하지 않으므로 비밀번호 변경하지 못하도록 차단
  }
  return res.render("users/change-password", {
    pageTitle: "Change Password"
  })
}
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id }
    },
    body: {
      oldPassword, newPassword, newPasswordConfirmation,
    }
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect."
    })
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation."
    })
  }
  user.password = newPassword;
  await user.save();
  req.flash("info", "Password Updated");
  //이렇게 해야 비밀번호 해시를 사용할 수 있음
  return res.redirect("/users/logout");
  //비밀번호 변경후 다시 로그인하도록 함
  //다시 로그인하면 session에 있는 user정보도 자동 업데이트됨
}
export const see = async (req, res) => {
  const { id } = req.params;
  //double populate하는 법
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    }
  });
  if (!user) {
    return res.status(404).render("404", {
      pageTitle: "User Not Found"
    });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  })
}