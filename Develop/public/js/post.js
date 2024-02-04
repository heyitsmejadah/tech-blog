const titleEl = document.querySelector("#title");
const contentEl = document.querySelector("#content");
const createLink = document.querySelector("#createPost");
const cancelBtn = document.querySelector("#cancelPost");
const updateBtn = document.querySelector("#updatePost");
const deleteBtn = document.querySelector("#deletePost");

const cancelPostHandler = async (event) => {
    event.preventDefault();
    document.location.replace("/dashboard");
};

const updatePostHandler = async (event) => {
    event.preventDefault();
    const title = titleEl.value;
    const content = contentEl.value;

    if (title.length > 0 && content.length > 0) {
        const id = document.location.pathname.split("/").at(-1);
        const response = await fetch(`/dashboard/post/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            document.location.replace(`/dashboard`);
        } else {
            alert("Failed to update post.");
        }
    } else {
        alert("Your post must have a title and contents");
    }
};

const deletePostHandler = async (event) => {
    event.preventDefault();

    const id = document.location.pathname.split("/").at(-1);
    const response = await fetch(`/dashboard/post/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
        document.location.replace("/dashboard");
    } else {
        alert("Failed to delete post.");
    }
};

const createPostHandler = async (event) => {
    event.preventDefault();
    
    const title = titleEl.value;
    const content = contentEl.value;

    if (title.length > 0 && content.length > 0) {
        const response = await fetch("/dashboard/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            document.location.replace(`/dashboard`);
        } else {
            alert("Failed to create post.");
        }
    }
};

if (createLink) {
    createLink.addEventListener("click", createPostHandler);
    cancelBtn.addEventListener("click", cancelPostHandler);
} else {
    updateBtn.addEventListener("click", updatePostHandler);
    deleteBtn.addEventListener("click", deletePostHandler);
}
