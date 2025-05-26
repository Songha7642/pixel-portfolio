window.onload = function () {
  const video = document.getElementById("introVideo");
  const enterBtn = document.getElementById("enterBtn");
  const scene1 = document.getElementById("scene1");
  const scene2 = document.getElementById("scene2");

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
      document.getElementById("scene2").style.display = "none";
      document.getElementById(projectId).classList.add("active");
    });
  });

  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".project-scene").forEach(scene => {
        scene.classList.remove("active");
      });
      document.getElementById("scene2").style.display = "block";
    });
  });

};

