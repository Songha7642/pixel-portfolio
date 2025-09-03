/* =========================================================
   Script chính
   - Điều khiển Scene1 (video intro) -> Scene2 (landing)
   - Scene2: cuộn mượt + highlight nav + underline chạy theo mục
   - Blog (Scene6): đăng bài, render tức thì; Firestore sort theo createdAt
   ========================================================= */

// ===== Lấy helpers từ firebase-init.js (đã expose trên window) =====
const {
  db, storage,
  addDoc, collection, getDocs, deleteDoc, doc, query, orderBy,
  ref, uploadBytes, getDownloadURL, deleteObject,
  serverTimestamp
} = window.firebaseApp || {};

// --------- Utils ---------
const formatTime = (ts) => new Date(ts).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
const saveScene = (key) => localStorage.setItem("currentScene", key);
const readScene = () => localStorage.getItem("currentScene");

// ===== Chạy khi DOM sẵn sàng =====
window.addEventListener("DOMContentLoaded", () => {
  // ---------- DOM refs ----------
  const scene1 = document.getElementById("scene1");
  const scene2 = document.getElementById("scene2");
  const scene6 = document.getElementById("scene6");

  const video = document.getElementById("introVideo");
  const enterBtn = document.getElementById("enterBtn");

  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
  const underline = document.querySelector(".nav-underline");

  const blogTab = document.getElementById("blogTab");
  const blogTab2 = document.getElementById("blogTab2"); // có thể không tồn tại
  const backToPortfolio = document.getElementById("backToPortfolio");

  const triggerPostPopup = document.getElementById("triggerPostPopup");
  const postPopup = document.getElementById("postPopup");
  const closePopup = document.getElementById("closePopup");
  const submitPost = document.getElementById("submitPost");
  const postTextEl = document.getElementById("postText");
  const postMediaEl = document.getElementById("postMedia");
  const postList = document.getElementById("postList");

  // ---------- Scene1 (intro video) ----------
  video?.addEventListener("canplaythrough", () => video.play().catch(()=>{}));
  video?.addEventListener("play", () => enterBtn?.classList.remove("show"));
  video?.addEventListener("ended", () => enterBtn?.classList.add("show"));
  enterBtn?.addEventListener("click", () => { showScene2(); });

  // ---------- Phục hồi scene ----------
  const savedScene = readScene();
  if (savedScene === "scene6") showBlog();
  else if (savedScene && savedScene.startsWith("project")) {
    // vẫn hỗ trợ mở scene dự án nếu có
    scene1.style.display = "none"; scene2.style.display = "none";
    document.getElementById(savedScene)?.classList.add("active");
  } else if (savedScene === "scene2") {
    showScene2();
  } else {
    // lần đầu
    scene1.style.display = "flex"; scene2.style.display = "none";
  }

  // ---------- Scene2: nav cuộn mượt + underline ----------
  // Nếu click menu từ Scene1/Scene6 → mở Scene2 rồi cuộn tới section
  function handleNavClick(e){
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    showScene2(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  navLinks.forEach(a => a.addEventListener("click", handleNavClick));

  // Theo dõi section để highlight menu + di chuyển underline
  const sections = Array.from(document.querySelectorAll("#land1,#products,#gallery,#about,#contact"));
  const observer = new IntersectionObserver((entries) => {
    // Chọn entry gần viewport nhất
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = "#"+visible.target.id;
    navLinks.forEach(a=>{
      a.classList.toggle("active", a.getAttribute("href")===id);
      if (a.classList.contains("active")) moveUnderline(a);
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: [0.2, 0.4, 0.6] });
  sections.forEach(s => observer.observe(s));

  function moveUnderline(activeLink){
    if (!underline || !activeLink) return;
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const width = linkRect.width;
    const x = linkRect.left - navRect.left;
    underline.style.width = `${width}px`;
    underline.style.transform = `translateX(${x}px)`;
  }

  // ---------- Gallery mở project scene (giữ logic cũ) ----------
  document.querySelectorAll(".project-img").forEach(img=>{
    img.addEventListener("click", ()=>{
      const pid = img.getAttribute("data-id");
      scene2.style.display = "none";
      document.getElementById(pid)?.classList.add("active");
      saveScene(pid);
    });
  });
  document.querySelectorAll(".close-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".project-scene").forEach(sc => sc.classList.remove("active"));
      showScene2();
    });
  });

  // ---------- Blog: mở scene6 ----------
  function showBlog(){
    scene1.style.display = "none";
    scene2.style.display = "none";
    scene6.classList.remove("hidden"); scene6.classList.add("active");
    saveScene("scene6");
    loadPosts();
  }
  blogTab?.addEventListener("click", (e)=>{ e.preventDefault(); showBlog(); });
  blogTab2?.addEventListener("click", (e)=>{ e.preventDefault(); showBlog(); });
  backToPortfolio?.addEventListener("click", ()=> showScene2());

  // Popup
  triggerPostPopup?.addEventListener("click", ()=>{
    postPopup.classList.add("active"); postTextEl?.focus();
  });
  closePopup?.addEventListener("click", ()=>{
    postPopup.classList.remove("active");
  });

  // ---------- Helper: hiển thị Scene2 + callback (cuộn) ----------
  function showScene2(cb){
    scene1.style.display = "none";
    scene6.classList.remove("active"); scene6.classList.add("hidden");
    scene2.style.display = "block";
    saveScene("scene2");
    // gọi sau một frame để đảm bảo layout đã hiện, tránh scroll bị “nhảy”
    requestAnimationFrame(()=>{ cb && cb(); });
  }

  // ---------- Blog: Render 1 bài viết ----------
  function renderPostItem({ id, text, mediaUrl, mediaPath, timestamp }){
    const wrap = document.createElement("div");
    wrap.className = "post";
    const time = formatTime(timestamp);
    const safeText = (text||"").replace(/</g,"&lt;");
    const isVideo = (mediaUrl||"").toLowerCase().endsWith(".mp4");
    const mediaHtml = mediaUrl ? (isVideo ? `<video controls src="${mediaUrl}"></video>` : `<img src="${mediaUrl}" alt="media">`) : "";

    wrap.innerHTML = `
      <span class="timestamp">🕒 ${time}</span>
      <button class="delete-btn" title="Xoá bài" data-id="${id}" data-path="${mediaPath||""}">🗑️</button>
      <p>${safeText}</p>
      ${mediaHtml}
    `;

    // nút xoá
    wrap.querySelector(".delete-btn").addEventListener("click", async ()=>{
      try{
        await deleteDoc(doc(db,"posts",id));
        const path = mediaPath;
        if (path) { try{ await deleteObject(ref(storage, path)); }catch{} }
        wrap.remove();
      }catch(e){ console.error(e); alert("Không thể xoá bài. Thử lại sau."); }
    });

    return wrap;
  }

  // ---------- Blog: Đăng bài (append ngay) ----------
  submitPost?.addEventListener("click", async ()=>{
    if (!db) return alert("Firebase chưa khởi tạo.");

    const text = (postTextEl?.value||"").trim();
    const file = postMediaEl?.files?.[0];
    if (!text && !file) return alert("Hãy nhập nội dung hoặc chọn hình/video.");

    // giới hạn 10MB
    const MAX = 10*1024*1024;
    if (file && file.size > MAX) return alert("File quá lớn (>10MB).");

    submitPost.disabled = true;
    submitPost.textContent = "Đang đăng...";

    let mediaUrl = "", mediaPath = "";
    const now = Date.now();

    try{
      if (file){
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
        mediaPath = `media/${now}_${safe}`;
        const storageRef = ref(storage, mediaPath);
        await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(storageRef);
      }

      const newDoc = await addDoc(collection(db,"posts"),{
        text, mediaUrl, mediaPath, createdAt: serverTimestamp()
      });

      // reset popup + form
      postPopup.classList.remove("active");
      if (postTextEl) postTextEl.value = "";
      if (postMediaEl) postMediaEl.value = "";

      // hiển thị ngay
      const node = renderPostItem({ id:newDoc.id, text, mediaUrl, mediaPath, timestamp: now });
      postList.prepend(node);

    }catch(err){
      console.error("[SubmitPost]", err);
      alert("Đăng bài thất bại. Kiểm tra Console / Rules / bucket.");
    }finally{
      submitPost.disabled = false;
      submitPost.textContent = "Đăng";
    }
  });

  // ---------- Blog: Load toàn bộ bài theo createdAt desc ----------
  async function loadPosts(){
    if (!db) return;
    const qy = query(collection(db,"posts"), orderBy("createdAt","desc"));
    const snap = await getDocs(qy);
    postList.innerHTML = "";
    snap.forEach(docSnap=>{
      const d = docSnap.data();
      const ts = d.createdAt?.toMillis?.() ?? Date.now();
      const node = renderPostItem({
        id: docSnap.id,
        text: d.text,
        mediaUrl: d.mediaUrl,
        mediaPath: d.mediaPath,
        timestamp: ts
      });
      postList.appendChild(node);
    });
  }

  // Nếu reload đang ở blog → tải dữ liệu
  if (readScene()==="scene6") loadPosts();

  // bỏ trạng thái loading
  document.body.classList.remove("loading");
});
