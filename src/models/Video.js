import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxLength: 140, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map(word => word.startsWith("#") ? word : `#${word}`);
});
//Video모델에서 formatHashtags()로 접근가능한 메서드를 만들어줌

const Video = mongoose.model("video", videoSchema);

export default Video;