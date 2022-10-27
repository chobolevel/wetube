const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentList = document.querySelectorAll(".video_comments ul li");

const removeElement = async (event) => {
  const parent = event.target.parentElement;
  const videoId = videoContainer.dataset.id;
  const commentId = parent.dataset.id;
  await fetch(`/api/comments/${commentId}/${videoId}`, {
    method: "DELETE",
  })
  parent.remove();
}

const addComment = (text, newCommentId) => {
  const videoComments = document.querySelector(".video_comments").querySelector("ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  newComment.className = "video_comment";
  icon.className = "fas fa-comment";
  span.innerText = " " + text;
  span2.innerText = "❌";
  span2.addEventListener("click", removeElement);
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  newComment.dataset.id = newCommentId;
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const video = videoContainer.dataset.id;
  if (text === "") {
    //텍스트가 비어있을 경우 api호출하지 않음
    return;
  }
  const response = await fetch(`/api/videos/${video}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

commentList.forEach((comment) => {
  comment.children[2].addEventListener("click", (event) => removeElement(event));
});