import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title : {type : String, required : true, trim : true, maxLength : 80},
  description : {type : String, required : true, trim : true, maxLength : 140, minLength : 20},
  createdAt : {type : Date, required : true, default : Date.now},
  hashtags : [{type : String, trim : true}],
  meta : {
    views : {type : Number, default : 0, required : true},
    rating : {type : Number, default : 0, required : true},
  },
});
//미들웨어(save이벤트)
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0].split(",").map(word => word.startsWith("#") ? word : `#${word}`);
})

const Video = mongoose.model("video", videoSchema);

export default Video;