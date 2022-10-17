import Video from "../models/Video";
import User from "../models/User";

//Home
export const home = async (req, res) => {
  //조건 없이 찾아서 모든 영상을 보여줌
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};
//watch video
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video, owner });

};
//Edit Video
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" })
  }
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
}
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" })
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
}
//Upload Video
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
}
export const postUpload = async (req, res) => {
  const { user: { _id } } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      fileUrl,
      description,
      createdAt: Date.now(),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message
    });
    //DB저장에 오류가 발생했을 때 오류 메세지를 upload페이지로 보냄
  }
}
//Delete Video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findOneAndDelete(id);
  return res.redirect("/");
}
//Search Video 
export const search = async (req, res) => {
  const { keyword } = req.query;
  //url에서 제공하는 정보 가져옴(query 이용)
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
        //키워드가 포함된 모든 검색결과 가져옴
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
}