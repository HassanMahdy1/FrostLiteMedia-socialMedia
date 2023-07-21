const baseurl = "https://tarmeezAcademy.com/api/v1";


let addcommentdiv;

getuser();



function getcerrentuserid() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("userid");
    return id
}

function getuser() {
    toggleLoader(true);

    const id = getcerrentuserid();
  axios.get(`${baseurl}/users/${id}`).then((response) => { 
        toggleLoader(false);

        const user = response.data.data
        document.getElementById("email-info").innerHTML = user.email
        document.getElementById("name-info-arab").innerHTML = user.name;
        document.getElementById("name-info-english").innerHTML = user.username;
        document.getElementById("img-info").src = user.profile_image;
        document.getElementById("posts_count").innerHTML = user.posts_count;
        document.getElementById("comments_count").innerHTML = user.comments_count;
        
    })
}










getPosts();

// get posts
function getPosts() {

    const id = getcerrentuserid();
  axios
    .get(`${baseurl}/users/${id}/posts`)
    .then((response) => {
      const posts = response.data.data.reverse();

      document.getElementById("user-posts").innerHTML = "";

      for (post of posts) {
        const author = post.author;

        //show or hide the (edit)button
        let user = getcurrentusers();
        let isMyPost = user != null && post.author.id == user.id;
        let editbutton = ``;
        let deletebutton = ``;
        if (isMyPost) {
          editbutton = `<i onclick="editPostButtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')" id="buttonEdite" class='bx bxs-edit' style=" right: 0; cursor:pointer;" ></i>`;
        }
        if (isMyPost) {
          deletebutton = `<i id="buttonDelete" onclick="delet(${JSON.stringify(
            post.id
          )})" class='bx bxs-trash' style="cursor:pointer;"></i>`;
        }


        let content = `
                        <div class="card" style=" box-shadow: 0px 3px 5px -3px; margin-top: 20px;">
                            <div class="card-header d-flex align-items-center justify-content-between">
                              <div>
                                <img src="${author.profile_image}"  style="width: 40px; height: 40px;border-radius: 50%; border: 1px solid rgb(106, 106, 106);">
                                <p class="d-inline fw-semibold">${author.name}</p>
                              </div>
                              <div id="editanddelete" class="gap-2" style="display:flex;">
                              ${editbutton}
                              ${deletebutton}
                              </div>
                            </div>
                            <div onclick="postClicked(${post.id})" style="cursor: pointer;" class="p-3">
                                <div  class="card-body" style="overflow: hidden; display: flex;justify-content: center; align-items: center;padding: 10px 0 0 0;">
                                    <img id="postImg" src="${post.image}" alt="photo" style="width:70%; border-radius: 4px;" >
                                </div>
                                <p class="d-inline " style="font-size: 16px; color: rgb(138, 138, 138);">${post.created_at}</p>
                                <div class="p-2">
                                    <h6 id="postbody">
                                    ${post.body}
                                    </h6> 
                                    <hr>
                                    <div style="display: flex; align-items: center; gap: 5px;">
                                        <i class='bx bx-message'></i>
                                        <span>(${post.comments_count}) Comments</span>
                                        <span id="post-tags-${post.id}"> <button class="btn btn-sm rounded-5" style="background:gray; color:white;"> policy</button> </span> 

                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
                    `;

        document.getElementById("user-posts").innerHTML += content;
        const idoda = `post-tags-${post.id}`;
        document.getElementById(idoda).innerHTML = "";
        for (tag of post.tags) {
          let tagscontent = `
                        <span id="post-tags"> <button class="btn btn-sm rounded-5" style="background:gray; color:white;"> ${tag.name} </button> </span> 
                        `;
          document.getElementById(idoda).innerHTML += tagscontent;
        }
      }
      onrelodToken();
    })
    .finally(() => {
      toggleLoader(false);
    });
}



















































































// login

function loginBtnClicked() {
  let usernameInputvalue = document.getElementById("userNameInput").value;
  let passwordinputvalue = document.getElementById("password").value;
  const params = {
    username: usernameInputvalue,
    password: passwordinputvalue,
  };
  toggleLoader(true);
  const url = `${baseurl}/login`;
  axios
    .post(url, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      notifcation("success", "login successfull", "bx bxs-check-circle");
      onrelodToken();
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      notifcation("danger", errorMessage, "bx bxs-x-circle");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function getUserANDimageprofile() {
  let user = JSON.parse(localStorage.getItem("user"));
  let navUserName = document.getElementById("navUserName");
  navUserName.innerHTML = user.username;
  let profileimage = document.getElementById("imgprofile");
  profileimage.src = user.profile_image;
}

// notifcation

function notifcation(color, word, icon) {
  let notifcation = `
     <div id="notifcation" class="d-flex align-items-center justify-content-start overflow-hidden position-relative" style="width: 320px; height: 60px;z-index: 5;  background: #f9f9f9; border-radius: 10px;     box-shadow: 0 0 3px 0;  " >
            <div style="width: 5px; height: 100%;" class="bg-${color}"></div>
            <i class='${icon} text-${color} px-3 fs-1' ></i>
            <div style="padding: 0 30px 0 5px; font-weight: 800;"> ${word}</div>
            <i id="x" class='bx bx-x position-absolute' style="top:10px; right: 10px; font-size: 20px; cursor: pointer; "></i>
        </div>
    `;
  document.getElementById("notfDad").innerHTML = notifcation;
  document.getElementById("x").onclick = () => {
    x.parentElement.remove();
  };
  setTimeout(() => {
    document.getElementById("notfDad").innerHTML = "";
  }, 6000);
}

// logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  notifcation("danger", "logout successfully", "bx bxs-check-circle");
  const modal = document.getElementById("logout");
  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
  onrelodToken();
}

// REGISTER

function registerBtnClicked() {
  let name = document.getElementById("nameRegister").value;
  let username = document.getElementById("userNameInputregister").value;
  let password = document.getElementById("passwordregister").value;
  let image = document.getElementById("profileimage").files[0];
toggleLoader(true);
  let formdata = new FormData();
  formdata.append("name", name);
  formdata.append("username", username);
  formdata.append("password", password);
  formdata.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const url = `${baseurl}/register`;

  axios
    .post(url, formdata, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("Register");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      onrelodToken();
      notifcation(
        "success",
        "Your registration has been successful. Welcome!",
        "bx bxs-check-circle"
      );
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      notifcation("danger", errorMessage, "bx bxs-x-circle");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

// add post
function creatBtnClicked() {
  toggleLoader(true);
  let body = document.getElementById("postBodyInput").value;
  let image = document.getElementById("addpostimage").files[0];
  const token = localStorage.getItem("token");

  let formdata = new FormData();
  formdata.append("body", body);
  formdata.append("image", image);

  const url = `${baseurl}/posts`;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  axios
    .post(url, formdata, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("addpostmodal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      notifcation(
        "success",
        "The post has been added successfully",
        "bx bxs-check-circle"
      );
    
    })
    .catch((err) => {
      let errorMessage = err.response.data.message;

      notifcation("danger", errorMessage, "bx bxs-x-circle");
    }).finally(() => {
      toggleLoader(false);
      location.reload();
    })
}

function getcurrentusers() {
  let user = null;
  const storiguser = localStorage.getItem("user");
  if (storiguser != null) {
    user = JSON.parse(storiguser);
  }
  return user;
}

// replace the button
function buttonsHideShow(none, flex) {
  let buttons = document.getElementById("buttons");
  let logoutbtn = document.getElementById("logoutbtn");

  buttons.style.display = none;
  logoutbtn.style.display = flex;

  let user = getcurrentusers();
  let navUserName = document.getElementById("navUserName");
}

// onrelodToken
function onrelodToken() {
  if (localStorage.key("token") == "token") {
    buttonsHideShow("none", "flex");
    getUserANDimageprofile();
        document.getElementById("links").style.display = "flex";

  } else {
    buttonsHideShow("flex", "none");
        document.getElementById("links").style.display = "none";

  }
}
onrelodToken();

if (localStorage.key("product") == "product") {
  localStorage.removeItem("product");
}

// delete post
function delet(id) {
  let postid = id;
  document.getElementById("post-id-Inputdelet").value = postid;
  let postModal = new bootstrap.Modal(
    document.getElementById("deletmpostodal"),
    {}
  );
  postModal.show();
}
toggleLoader(true);
function deletpost() {
  let postId = document.getElementById("post-id-Inputdelet").value;
  const token = localStorage.getItem("token");
  const url = `${baseurl}/posts/${postId}`;
  const headers = {
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(url, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("deletmpostodal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      notifcation(
        "danger",
        "The post has been Delete successfully",
        "bx bxs-check-circle"
      );
      window.location = `index.html`;
    })
    .catch((err) => {
      let errorMessage = err.response.data.message;
      notifcation("danger", errorMessage, "bx bxs-x-circle");
    })
    .finally(() => {
      toggleLoader(false);
       location.reload();

    });
}



// edited post
function editPostButtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-id-Input").value = post.id;

  let postModal = new bootstrap.Modal(
    document.getElementById("editpostmodal"),
    {}
  );
  postModal.show();

  document.getElementById("postBodyInputedit").value = post.body;
}

function editBtnClickedmodal() {
  let postId = document.getElementById("post-id-Input").value;
toggleLoader(true);
  let body = document.getElementById("postBodyInputedit").value;
  let image = document.getElementById("editpostimage").files[0];
  const token = localStorage.getItem("token");

  let formdata = new FormData();
  formdata.append("body", body);
  formdata.append("image", image);
  formdata.append("_method", "put");

  const url = `${baseurl}/posts/${postId}`;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  axios
    .post(url, formdata, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("editpostmodal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      notifcation(
        "success",
        "The post has been Edit successfully",
        "bx bxs-check-circle"
      );
    })
    .catch((err) => {
      let errorMessage = err.response.data.message;

      notifcation("danger", errorMessage, "bx bxs-x-circle");
    })
    .finally(() => {
      toggleLoader(false);
      location.reload();

    });
}




function useronclick(userId) {
  window.location = `profil.html?userid=${userId}`;
}

function profileclicked() {
  const user = getcurrentusers();
  const userId = user.id;

  window.location = `profil.html?userid=${userId}`;
}





// toggle loader
 
function toggleLoader(show=true ) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible"
  } else {
    
    document.getElementById("loader").style.visibility = "hidden"
  }
}