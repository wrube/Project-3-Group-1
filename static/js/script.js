let tabs = document.querySelectorAll('[data-tab-target]')
let tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        let target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        tabs.forEach(tab => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
        target.classList.add('active')

        // If the clicked tab is the one containing the map, invalidate the map size
        if (tab.dataset.tabTarget === '#pricing') {
            map1.invalidateSize();
        }
        if (tab.dataset.tabTarget === '#about') {
            map2.invalidateSize();
        }
    })
})

"use strict";

const userId = {
    name: null,
    identity: null,
    image: null,
    message: null,
    date: null
}

const userComment = document.querySelector(".usercomment");
const publishBtn = document.querySelector("#publish");
const comments = document.querySelector(".comments");
const userName = document.querySelector(".user");

// Function to add a new post to local storage and append it to the page
function addPostToLocalStorage(post) {
    let storedPosts = localStorage.getItem("comments");
    if (!storedPosts) {
        storedPosts = [];
    } else {
        storedPosts = JSON.parse(storedPosts);
    }
    storedPosts.push(post);
    localStorage.setItem("comments", JSON.stringify(storedPosts));
}

// Function to retrieve comments from local storage and append them to the page
function displayCommentsFromLocalStorage() {
    const storedPosts = localStorage.getItem("comments");
    if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        parsedPosts.forEach(post => {
            appendPostToPage(post);
        });
    }
}

// Function to append a single post to the page
function appendPostToPage(post) {
    let published =
        `<div class="parents">
            <img src="${post.image}">
            <div>
                <h1>${post.name}</h1>
                <p>${post.message}</p>
                <div class="engagements">
                    <img src="static/images/like.png">
                    <img src="static/images/share.png">
                </div>
                <span class="date">${post.date}</span>
            </div>
        </div>`;
    comments.innerHTML += published;
}

userComment.addEventListener("input", e => {
    if (!userComment.value) {
        publishBtn.setAttribute("disabled", "disabled");
        publishBtn.classList.remove("abled");
    } else {
        publishBtn.removeAttribute("disabled");
        publishBtn.classList.add("abled");
    }
})

function addPost() {
    if (!userComment.value) return;
    userId.name = userName.value;
    if (userId.name === "Anonymous") {
        userId.identity = false;
        userId.image = "static/images/anonymous.png";
    } else {
        userId.identity = true;
        userId.image = "static/images/user.png";
    }

    userId.message = userComment.value;
    userId.date = new Date().toLocaleString();

    // Add the new post to local storage
    addPostToLocalStorage(userId);

    // Append the new post to the page
    appendPostToPage(userId);

    userComment.value = "";

    let commentsNum = document.querySelectorAll(".parents").length;
    document.getElementById("comment").textContent = commentsNum;
}

// Display comments from local storage when the page loads
displayCommentsFromLocalStorage();

publishBtn.addEventListener("click", addPost);
