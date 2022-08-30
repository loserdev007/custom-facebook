// const main = document.getElementById('main');

// fetch('https://jsonplaceholder.typicode.com/posts')
//   .then(response => response.json())
//   .then(json => {
//    console.log(json)

//       for(const key in json){
//          if(json[key].title.length < 30 || json[key].title.length > 60 || json[key].body.length > 150 ) continue;
//          const randomColor = Math.floor(Math.random() * 2 ** 24).toString(16).padStart(6, '0'); 
//          const newEl = document.createElement('div');
//          newEl.innerHTML = `
//          <div class="card post">
//             <div class="thumb" style="background-color: #${randomColor}"></div>
//             <!-- <img src="..." class="card-img-top" alt="..."> -->
//             <div class="card-body post-body">
//                <h5 class="card-title post-title fs-4">${json[key].title}</h5>
//                <p class="card-text post-text">${json[key].body}</p>
//                <div class="d-flex buttons">
//                   <button class="btn btn-primary w-50 rounded-pill">Read More</button>
//                   <button class="btn btn-primary w-50 ms-1 rounded-pill"><span class="special">44</span> Comments</button>
//                </div>
//             </div>
//          </div>`;
//          main.append(newEl);

//       }


//   })

// Defaults
const __fName = 'fname';
const __lName = 'lname';
const __email = 'email';
const __pass = 'pass';
const __id = 'ID';


const __add = 'add';
const __delete = 'delete';
const __update = 'update';
const __read = 'read';

const __login = 'login';
const __signUp = 'signup';
const __cookieRemoveText = `=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
const __cookieKeyEmail = __email;
const __cookieKeyPass = __pass;

const __months = [
   'Jan',
   'Feb',
   'Mar',
   'Apr',
   'May',
   'Jun',
   'Jul',
   'Aug',
   'Sep',
   'Oct',
   'Nov',
   'Dec'
]





// const text = 'An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.';

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  console.log(typeof msgUint8 + ' : ' + msgUint8);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  console.log(typeof hashBuffer + ' : ' + hashBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  console.log(typeof hashArray + ' : ' + hashArray);
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  console.log(typeof hashHex + ' : ' + hashHex);
  return hashHex;
}

function formatNumber(num, size) {
   num = num.toString();
   while (num.length < size) num = "0" + num;
   return num;
}


// Firebase Init
firebase.initializeApp({
   apiKey: "AIzaSyCvOuIXLm6MyTUFJF7tZ19ayOouogSLNhw",
   authDomain: "custom-facebook-3ec5b.firebaseapp.com",
   projectId: "custom-facebook-3ec5b",
   storageBucket: "custom-facebook-3ec5b.appspot.com",
   messagingSenderId: "845138997867",
   appId: "1:845138997867:web:2744b7ae683a255424f72e"
});
const db = firebase.firestore();




const postContainer = document.getElementById('newsfeed');
const modalContainer = document.getElementById('modal-container');
const loginContainer = document.getElementById('sign-in');
const loginWait = document.querySelector('#sign-in .wait');
const logOut = document.getElementById('log-out');
// Sign Up
const signUpContainer = document.getElementById('sign-up');
const signUpWait = document.querySelector('#sign-up .wait');
const signUpSubmit = document.getElementById('sUp-submit');

const newPostContent = document.getElementById('newpost-content');
const postBtn = document.getElementById('new-post');
const postWait = document.querySelector('.add-post .wait');
const postModalContainer = document.getElementById('post-modal-container');


const postModalTrigger = document.getElementById('post-modal-trigger');
// db.collection("posts").doc('ass').get().then((doc) => {
   //    console.log(doc.data());
   // }).catch((error) => {
//    console.log("Error getting document:", error);
// });

function modalHandler(mode){
   if(mode == __signUp){
      // console.log("Signup Mode");
      modalContainer.style.setProperty("display", "flex", "important");
      loginContainer.style.setProperty("display", "none", "important");
      signUpContainer.style.setProperty("display", "flex", "important");
      postContainer.style.setProperty("display", "none", "important");
      postContainer.innerHTML = '<h3 class="mb-3 text-center">All Posts</h3>';
      makeInputEmpty();
   }else if(mode == __login){
      // console.log("Login Mode");
      modalContainer.style.setProperty("display", "flex", "important");
      signUpContainer.style.setProperty("display", "none", "important");
      loginContainer.style.setProperty("display", "flex", "important");
      postContainer.style.setProperty("display", "none", "important");
      postContainer.innerHTML = '<h3 class="mb-3 text-center">All Posts</h3>';
      makeInputEmpty();
   }else{
      modalContainer.style.setProperty("display", "none", "important");
      signUpContainer.style.setProperty("display", "none", "important");
      loginContainer.style.setProperty("display", "none", "important");
      postContainer.style.setProperty("display", "block", "important");
      signUpWait.style.setProperty("display", "none", "important");
      loginWait.style.setProperty("display", "none", "important");
      postWait.style.setProperty("display", "none", "important");
   }
}


function makeInputEmpty(){
   document.getElementById('sUp-fname').value = '';
   document.getElementById('sUp-lname').value = '';
   document.getElementById('sUp-email').value = '';
   document.getElementById('sUp-pass').value = '';
   document.getElementById('sIn-email').value = '';
   document.getElementById('sIn-pass').value = '';
   newPostContent.value = ''
}


function initCheck(){
   const cookiess = cookieHandler(__read, []);
   const {email,pass} = cookiess;
   digestMessage(cookiess[__email] + cookiess[__pass]).then((digestHex) => {
      // console.log(digestHex);
      db.collection("user").doc(digestHex).get().then((doc) => {
         if (doc.exists && doc.data().email == email && doc.data().pass == pass) {
            showData();
         } else {
            modalHandler(__login);
         }
      }).catch((error) => {
         
      });
   });
}

function cookieHandler(operation, ...pairs) {
   if(operation == __add || operation == __update){
      for(const singlePair of pairs){
         document.cookie = `${singlePair.key}=${singlePair.content.trim()};`;
      }
   }
   else if(operation == __delete){
      for(const singlePair of pairs){
         document.cookie = `${singlePair.key}=;${__cookieRemoveText}`;

      }
   }
   else if(operation == __read){
      if(!document.cookie.includes(__id)) return {};
      const data = {};
      const cookies = document.cookie.split(';');
      for(const singleCookie of cookies){
         data[singleCookie.split('=')[0].trim()] = singleCookie.split('=')[1].trim();
         // else if(singleCookie.includes(__pass)) data[__pass] = singleCookie.replace(`${__pass}=`, '').trim()
      }
      // console.log(data)
      return data;
   }
}

// cookieHandler(__add, {key: 'name', content: 'Md Nahid Hasa'},{key: 'email', content: 'nahid@gmail.com'},{key: 'pass', content: 'aoihdoashd'})


function signUp (fname, lname, email, pass){
   // const user = 
   digestMessage(email).then((digestHex) => {
      db.collection("users").doc(digestHex).set({
            [__fName]: fname,
            [__lName]: lname,
            [__email]: email,
            [__pass]: pass,
            liked: [],
            uuid: digestHex

         }).then((docss) => {
            console.log("docss: ", docss);
         cookieHandler(
            __add,
            {
               key: __email,
               content: email
            },{
               key: __pass,
               content: pass
            },{
               key: __fName,
               content: fname
            },{
               key: __lName,
               content: lname
            },{
               key: __id,
               content: digestHex
            }
         )
         // modalHandler("");
         showData();
      })  
      .catch((error) => {
         console.error("Error");
      });
   });
}

function login(email, pass){
   digestMessage(email + pass).then((digestHex) => {
      console.log(email,pass)
         db.collection("user").doc(digestHex).get().then((doc) => {
            if (doc.exists && doc.data().email == email && doc.data().pass == pass) {
               cookieHandler(
                  __add,
                  {
                     key: __email,
                     content: email
                  },{
                     key: __pass,
                     content: pass
                  },{
                     key: __fName,
                     content: doc.data()[__fName]
                  },{
                     key: __lName,
                     content: doc.data()[__lName]
                  },{
                     key: __id,
                     content: digestHex
                  }
               )
               // modalHandler("");
               showData();
            }
         })
         .catch((error) => {
            console.error("Error adding document: ", error);
         });
      });
      // const emailCheck = db.collection("user").where("email", "==", email);
      // const passCheck = db.collection("user").where("pass", "==", pass);
      // console.log(emailCheck, passCheck);
      // if(email && pass){
      //    // console.log(passCheck.data());
      //    document.cookie = `a=|$#%|${email}|$#%|${pass}|$#%|${docRef.id};`;
      //    modalHandler('');
      //    showData();
      // }
}

function post(postContent){
   const cookie = cookieHandler(__read, []);
   const post = {};
   const date = new Date();
   const ampm = date.getHours() > 12 ? 'PM' : 'AM';
   let hours = date.getHours() % 12;
   hours = hours ? hours : 12;
   post['content'] = postContent;
   post['userDetails'] = {
      userfname: cookie[__fName],
      userlname: cookie[__lName],
      userfullname: `${cookie[__fName]} ${cookie[__lName]}`,
      useremail: cookie[__email],
      userID: cookie[__id]
   };
   post['totalLikes'] = 0;
   post['dateTime'] = `<span class="time">${formatNumber(hours, 2)}:${formatNumber(date.getMinutes(),2)} ${ampm}</span> - <span class="date">${__months[date.getMonth()]} ${formatNumber(date.getDate(), 2)}, ${date.getFullYear()}</span> `;
   db.collection("posts").add(post).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      postModalContainer.style.setProperty("display", "none", "important");
      postWait.style.setProperty("display", "none", "important");
      makeInputEmpty();
      showData();
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });

   // let day = date.getDate();
   // let month = date.getMonth() + 1;
   // let year = date.getFullYear();

}



// Listeners
modalContainer.addEventListener('click', (e)=>{
   if(e.target.nodeName == "BUTTON" && e.target.id == 'sUp-submit'){
      signUpWait.style.setProperty("display", "flex", "important");
      // console.log('askjdghaskd')
      const fName = document.getElementById('sUp-fname').value;
      const lName = document.getElementById('sUp-lname').value;
      const email = document.getElementById('sUp-email').value;
      const pass = document.getElementById('sUp-pass').value;
      
      if(!fName || !lName || !email || !pass) return
      // console.log('pass')
      signUp(fName, lName, email, pass);
   }
   if(e.target.nodeName == "BUTTON" && e.target.id == 'sIn-submit'){
      loginWait.style.setProperty("display", "flex", "important");
      const email = document.getElementById('sIn-email').value;
      const pass = document.getElementById('sIn-pass').value;
      login(email, pass);
   }
   if(e.target.nodeName == "BUTTON" && e.target.id == 'sIn-change'){
      modalHandler('login');
   }
   if(e.target.nodeName == "BUTTON" && e.target.id == 'sUp-change'){
      modalHandler('signup');
   }
})






const showData = ()=>{
   postContainer.innerHTML = '<h3 class="mb-3 text-center">All Posts</h3>';
   db.collection("posts").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
         //  console.log(`${doc.id} => ${doc.data()}`);
         // console.log(doc.data());
         // console.log("Showing Data")
         
         const mData = doc.data();
         const userName = mData.userDetails.userfullname;
         const totalLikes = mData.totalLikes;
         const id = doc.id;
         const dateTime = mData.dateTime;
         const content = mData.content;
         let liked = 'dislike';
         db.collection("user").doc(cookieHandler(__read, [])[__id]).get().then((mdoc) => {
            // console.log(doc.data());
            let tmp = mdoc.data();
            console.log(tmp.liked.includes(id));
            tmp.liked.includes(id) ? liked = 'like' : liked = 'dislike';




            const newEl = document.createElement('div');
            newEl.className = 'post ';
            newEl.dataset.postid = id;
            newEl.innerHTML = `
            <h4 class="user-name m-0">${userName}</h4>
            <h5 class="post-details m-0">${dateTime}</h5>
            <p class="content">${content}</p>
            <div class="extras">
            <p class="total-likes mb-2"><span class="like">${totalLikes}</span> People liked this post</p>
            <div class="feedback d-flex justify-content-between">
            <button class="btn react rounded-pill col-4" onclick="like(this)" data-postid="${id}" data-totalLikes="${totalLikes}" data-liked="${liked}">Like</button>
            <button class="btn comment col-4 rounded-pill">Comment</button>
            <button class="btn share rounded-pill col-4">Share</button>
            </div>
            </div>
            `;
            
            postContainer.append(newEl)

            
         }).catch((error) => {console.log("Get Error")});




         
         
         
      });
      modalHandler('');
   });
}


logOut.addEventListener('click', (e)=>{
   cookieHandler(
      __delete,
      {
         key: __email,
         content: ''
      },{
         key: __pass,
         content: ''
      },{
         key: __id,
         content: ''
      }
   );
   modalHandler(__login);
})

postBtn.addEventListener('click', ()=>{
   const postContent = newPostContent.value;
   if(!postContent) return;
   postWait.style.setProperty("display", "flex", "important");
   post(postContent);
})
postModalTrigger.addEventListener('focusin',()=>{
   postModalContainer.style.setProperty("display", "flex", "important");
})


initCheck();


function like(e){
   if(e.dataset.liked == 'like'){
      e.style.setProperty("background-color", '#3e4147', "important");
      e.dataset.liked = 'dislike';
   }else if(e.dataset.liked == 'dislike'){
      e.style.setProperty("background-color", '#374562', "important");
      e.dataset.liked = 'like';
   }
   db.collection("user").doc(cookieHandler(__read, [])[__id]).get().then((doc) => {
      // console.log(doc.data());
      let tmp = doc.data();

      // Dislike
      if(tmp.liked.includes(e.dataset.postid)){
         const index = tmp.liked.indexOf(e.dataset.postid);
         if (index > -1) { // only splice array when item is found
            tmp.liked.splice(index, 1); // 2nd parameter means remove one item only
         }
         doc.ref.update(tmp);
         db.collection('posts').doc(e.dataset.postid).update({totalLikes: parseInt(e.dataset.totallikes) - 1})
         .then(() => {
            e.dataset.totallikes = parseInt(e.dataset.totallikes) - 1;
            // console.log(e.closest('.extras').querySelector('span.like'));
            e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
         })
        .catch((error) => {});
      }
      
      // Like
      else{
         tmp.liked.push(e.dataset.postid);
         doc.ref.update(tmp);
         db.collection('posts').doc(e.dataset.postid).update({totalLikes: parseInt(e.dataset.totallikes) + 1})
         .then(() => {
            e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
            // console.log(e.closest('.extras').querySelector('span.like'));
            e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
        })
        .catch((error) => {});
      }
      // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
      // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      }).catch((error) => {
         console.log("Error getting document:", error);
      });
  


   // db.collection('user').where("liked", "array-contains", e.dataset.postid).get()
   // .then((querySnapshot) => {
   //     querySnapshot.forEach((doc) => {
   //         let tmp = doc.data();
   //         const index = array.indexOf(5);
   //         if (index > -1) { // only splice array when item is found
   //         array.splice(index, 1); // 2nd parameter means remove one item only
   //         }

   //         console.log(tmp);
   //         doc.ref.update(tmp);
   //        // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
   //         // doc.data() is never undefined for query doc snapshots
   //         console.log(doc.id, " => ", doc.data());
   //     });
   // })
   // .catch((error) => {
   //     console.log("Error getting documents: ", error);
   // });
//   db.collection('posts').doc(e.dataset.postid).update({
//      // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
//      totalLikes: parseInt(e.dataset.totallikes) + 1
//   })
//   .then(() => {
//      e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
//      // console.log(e.closest('.extras').querySelector('span.like'));
//      e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
//  })
//  .catch((error) => {
//      // The document probably doesn't exist.
//      console.error("Error updating document: ", error);
//  });




   

//    db.collection('user').doc(e.dataset.postid).update({
//    // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
//       totalLikes: parseInt(e.dataset.totallikes) + 1
//    })
//    .then(() => {
//       e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
//       // console.log(e.closest('.extras').querySelector('span.like'));
//       e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
//    })
//    .catch((error) => {
//       // The document probably doesn't exist.
//       console.error("Error updating document: ", error);
//    });
}



function closeModal(e){
   postModalContainer.style.setProperty("display", "none", "important");
   postWait.style.setProperty("display", "none", "important");
   makeInputEmpty();
}




// const mm = "mdnirob2004@gmail.com"

// db.collection("cities").get({email:mm}).then((querySnapshot) => {
//    querySnapshot.forEach((doc) => {
//        // doc.data() is never undefined for query doc snapshots
//        console.log(doc.id, " => ", doc.data());
//    });
// });




digestMessage('test').then((digestHex) => {
   console.log(digestHex);
});