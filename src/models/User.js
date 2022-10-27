import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Video" }
  ],
});

//저장하기 전에 비밀번호를 5번 해싱
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
  //위 조건문은 비밀번호가 변경된 경우에만 해싱을 하도록함
});

const User = mongoose.model("User", userSchema);

export default User;