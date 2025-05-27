window.onload = function () {
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

};

