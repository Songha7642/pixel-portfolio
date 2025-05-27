// Scene 6
const {
  db,storage,addDoc,collection,getDocs,deleteDoc,doc,ref,uploadBytes,getDownloadURL,query,
  orderBy
} = window.firebaseApp;

const triggerPostPopup = document.getElementById("triggerPostPopup");
const postPopup = document.getElementById("postPopup");
const closePopup = document.getElementById("closePopup");
const submitPost = document.getElementById("submitPost");

// Chuyển scene
blogTab.addEventListener("click", () => {
  scene2.style.display = "none";
  scene6.classList.add("active");
});

backToPortfolio.addEventListener("click", () => {
  scene6.classList.remove("active");
  scene2.style.display = "block";
});


triggerPostPopup.addEventListener("click", () => {
  postPopup.classList.add("active");
});

closePopup.addEventListener("click", () => {
  postPopup.classList.remove("active");
});

submitPost.addEventListener("click", async () => {
  const text = document.getElementById("postText").value;
  const media = document.getElementById("postMedia").files[0];
  let mediaUrl = "";

  if (media) {
    const storageRef = ref(storage, "media/" + media.name);
    await uploadBytes(storageRef, media);
    mediaUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "posts"), {
    text,
    mediaUrl,
    timestamp: Date.now()
  });

  postPopup.classList.remove("active");
  document.getElementById("postText").value = "";
  document.getElementById("postMedia").value = "";
  loadPosts();
});


// Tải danh sách bài
function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

async function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  postList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const postId = docSnap.id;
    const time = formatTime(post.timestamp);

    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <span class="timestamp">🕒 ${time}</span>
      <button class="delete-btn" data-id="${postId}" title="Xoá bài">🗑️</button>
      <p>${post.text}</p>
      ${post.mediaUrl ? (
        post.mediaUrl.endsWith(".mp4")
          ? `<video controls src="${post.mediaUrl}"></video>`
          : `<img src="${post.mediaUrl}" />`
      ) : ""}
    `;
    postList.appendChild(div);
  });


  // Gán sự kiện xoá sau khi tạo nút
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await deleteDoc(doc(db, "posts", id));
      loadPosts(); // tải lại sau khi xoá
    });
  });
}



// Chính


window.onload = function () {
  loadPosts();
  const video = document.getElementById("introVideo");
  const enterBtn = document.getElementById("enterBtn");
  const scene1 = document.getElementById("scene1");
  const scene2 = document.getElementById("scene2");


  // Ẩn nút mỗi khi video phát lại
  video.addEventListener("play", () => {
    enterBtn.classList.remove("show");
  });

  // Đảm bảo video sẵn sàng phát
  video.addEventListener("canplaythrough", () => {
    video.play();
  });

  // Hiện nút khi video kết thúc
  video.addEventListener("ended", () => {
    enterBtn.classList.add("show");
  });

  enterBtn.addEventListener("click", () => {
    scene1.style.display = "none";
    scene2.style.display = "block";
  });

  document.querySelectorAll(".project-img").forEach(img => {
    img.addEventListener("click", () => {
      const projectId = img.getAttribute("data-id");
      scene2.style.display = "none";
      document.getElementById(projectId).classList.add("active");
    });
  });

  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".project-scene").forEach(scene => {
        scene.classList.remove("active");
      });
      scene2.style.display = "block";
    });
  });




  // Xác định nếu KHÔNG phải là reload → reset scene về scene1
  if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
    localStorage.removeItem("currentScene");
  }

  // 👉 Đọc trạng thái từ localStorage
  const savedScene = localStorage.getItem("currentScene");

  if (savedScene === "scene2") {
    scene1.style.display = "none";
    scene2.style.display = "block";
  } else if (savedScene && savedScene.startsWith("project")) {
    scene1.style.display = "none";
    scene2.style.display = "none";
    document.getElementById(savedScene).classList.add("active");
  } else {
    scene1.style.display = "flex";
    scene2.style.display = "none";
  }

  video.addEventListener("canplaythrough", () => {
    video.play();
  });

  video.addEventListener("ended", () => {
    enterBtn.classList.add("show");
  });

  enterBtn.addEventListener("click", () => {
    scene1.style.display = "none";
    scene2.style.display = "block";
    localStorage.setItem("currentScene", "scene2"); // ✅ lưu trạng thái
  });

  document.querySelectorAll(".project-img").forEach(img => {
    img.addEventListener("click", () => {
      const projectId = img.getAttribute("data-id");
      scene2.style.display = "none";
      document.getElementById(projectId).classList.add("active");
      localStorage.setItem("currentScene", projectId); // ✅ lưu trạng thái project
    });
  });

  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".project-scene").forEach(scene => {
        scene.classList.remove("active");
      });
      scene2.style.display = "block";
      localStorage.setItem("currentScene", "scene2"); // ✅ trở lại scene2
    });
  });

  document.body.classList.remove("loading");

  function formatTime(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }



};



