const baseurl = "https://tarmeezAcademy.com/api/v1";





let currentpage = 1
let lastpage = 1
window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.scrollY >= document.body.scrollHeight-3;
    if (endOfPage && currentpage < lastpage) {
        getPosts(false, currentpage );
        currentpage = currentpage+1

  }
});

// get posts
function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios.get(`${baseurl}/posts?limit=5&page=${page}`).then((response) => {
    
    toggleLoader(false);
      const posts = response.data.data;
        lastpage = response.data.meta.last_page;
      if (reload) {
          document.getElementById("posts").innerHTML = "";
      }
      
      for (post of posts) {
        const author = post.author;
        const authorprofimg = author.profile_image
      
      //show or hide the (edit)button
      let user = getcurrentusers()
      let isMyPost = user != null && post.author.id == user.id;
      let editbutton = ``
      let deletebutton = ``;
      if (isMyPost) {
        editbutton = `<i onclick="editPostButtnClicked('${encodeURIComponent(JSON.stringify(post))}')" id="buttonEdite" class='bx bxs-edit' style=" right: 0; cursor:pointer;" ></i>`
      }
      if (isMyPost) {
        deletebutton = `<i id="buttonDelete" onclick="delet(${JSON.stringify(post.id)})" class='bx bxs-trash' style="cursor:pointer;"></i>`;
      }



      let content = `
                        <div class="card" style=" box-shadow: 0px 3px 5px -3px; margin-top: 20px;">
                            <div class="card-header d-flex align-items-center justify-content-between">
                              <div onclick="useronclick(${author.id})" style="cursor:pointer">
                                <img id="imgprof" src="${author.profile_image}"  style="width: 40px; height: 40px;border-radius: 50%; border: 1px solid rgb(106, 106, 106);">
                                <p class="d-inline fw-semibold" >${author.name}</p>
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
      

                    document.getElementById("posts").innerHTML += content;
                    const idoda = `post-tags-${post.id}`;
                    document.getElementById(idoda).innerHTML = "";
                    for (tag of post.tags) {
                      let tagscontent = `
                      <span id="post-tags"> <button class="btn btn-sm rounded-5" style="background:gray; color:white;"> ${tag.name} </button> </span> 
                      `;
                      document.getElementById(idoda).innerHTML += tagscontent;
                      
                      
                    }


        document.getElementById("imgprof").src;
    }
    onrelodToken();
  }
  )
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
            <div id="wordnot" style="padding: 0 30px 0 5px; font-weight: 800;"> ${word}</div>
            <i id="x" class='bx bx-x position-absolute' style="top:5px; right: 2px; font-size: 20px; cursor: pointer;color:red; "></i>
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

  let formdata = new FormData();
  formdata.append("name", name);
  formdata.append("username", username);
  formdata.append("password", password);
  formdata.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const url = `${baseurl}/register`;
  toggleLoader(true);

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

// creat post
function creatBtnClicked() {
  toggleLoader(true);
  let postId = document.getElementById("post-id-Input").value;
  let isCreat = postId ==null || postId == "" 


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
      getPosts();
    })
    .catch((err) => {
      
      let errorMessage = err.response.data.message;

      notifcation("danger", errorMessage, "bx bxs-x-circle");
    }).finally(() => {
      toggleLoader(false);
    })
}
getPosts();







function getcurrentusers() {
  let user = null;
  const storiguser = localStorage.getItem("user");

  if (storiguser != null) {
    user = JSON.parse(storiguser);
  }
  return user;
}






// replace the button
function buttonsHideShow(none, flex, flexx) {
  let buttons = document.getElementById("buttons");
  buttons.style.display = none;
  let logoutbtn = document.getElementById("logoutbtn");
  logoutbtn.style.display = flex;
  let addpostbtn = document.getElementById("addpostbtn");
  addpostbtn.style.display = flexx;

  let user = getcurrentusers();
  let navUserName = document.getElementById("navUserName");


}

// onrelodToken
function onrelodToken() {
  if (localStorage.key("token") == "token") {
    buttonsHideShow("none", "flex", "flex");
    getUserANDimageprofile();
    document.getElementById("links").style.display = "flex";
    
  } else {
    document.getElementById("links").style.display = "flex";
    buttonsHideShow("flex", "none", "none");

  }
}
onrelodToken();


if (localStorage.key("product") == "product") {
localStorage.removeItem("product");
}




function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}







function editPostButtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  
  document.getElementById("post-id-Input").value = post.id;


  let postModal = new bootstrap.Modal(document.getElementById("editpostmodal"), {});
  postModal.show()

   document.getElementById("postBodyInputedit").value = post.body;
}





function editBtnClickedmodal() {
  let postId = document.getElementById("post-id-Input").value;

  let body = document.getElementById("postBodyInputedit").value;
  let image = document.getElementById("editpostimage").files[0];
  const token = localStorage.getItem("token");
 
toggleLoader(true);
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
      getPosts();
    })
    .catch((err) => {
      
      let errorMessage = err.response.data.message;

      notifcation("danger", errorMessage, "bx bxs-x-circle");
    })
    .finally(() => {
      toggleLoader(false);
    });
}




















// delete post
function delet(id) {
    let postid = id
    document.getElementById("post-id-Inputdelet").value = postid;
  // 
  let postModal = new bootstrap.Modal(document.getElementById("deletmpostodal"), {});
  postModal.show()

}



function deletpost() {
  let postId = document.getElementById("post-id-Inputdelet").value;
    
  const token = localStorage.getItem("token");
  const url = `${baseurl}/posts/${postId}`;
  const headers = {
    authorization: `Bearer ${token}`,
  };
toggleLoader(true);
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
       getPosts();
     })
     .catch((err) => {
       let errorMessage = err.response.data.message;
       notifcation("danger", errorMessage, "bx bxs-x-circle");
     })
     .finally(() => {
       toggleLoader(false);
     });
  
}








function useronclick(userId) {
  window.location = `profil.html?userid=${userId}`
}

function profileclicked() {
  const user = getcurrentusers();
  const userId = user.id
  
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