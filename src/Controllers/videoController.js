import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", {pageTitle : `Watching`});
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", {pageTitle : "Editing"});
}
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
}
export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle : "Upload Video"});
}
export const  postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  await Video.create ({
    title,
    description,
    createdAt : Date.now(),
    hashtags : hashtags.split(",").map(word => `#${word}`),
    meta : {
      views : 0,
      rating : 0,
    }
  });
  //create함수를 사용하면 자동으로 저장도 해줌
  return res.redirect("/");
}