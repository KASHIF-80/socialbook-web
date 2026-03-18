const socket = io()

function post(){
    const user = document.getElementById("user").value
    const text = document.getElementById("text").value

    fetch("/post",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({user,text})
    })
}

socket.on("newPost",addPost)

function addPost(p){
    document.getElementById("feed").innerHTML =
    `
    <div class="post" id="${p.id}">
        <h4>${p.user}</h4>
        <p>${p.text}</p>
        <button class="like-btn" onclick="like(${p.id})">
            ❤️ Like (${p.likes})
        </button>
    </div>
    `
    + document.getElementById("feed").innerHTML
}

function like(id){
    fetch("/like",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id})
    })
}

socket.on("refreshLikes",p=>{
    const div = document.getElementById(p.id)
    div.querySelector(".like-btn").innerHTML =
    `❤️ Like (${p.likes})`
})

fetch("/posts")
.then(res=>res.json())
.then(data=>data.forEach(addPost))