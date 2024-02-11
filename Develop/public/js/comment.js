const commentTextEl = document.querySelector("#comment");

const postCommentHandler = async (event) => {
    event.preventDefault();

    const content = commentTextEl.value.trim();

    if (content.length > 0) {
        const post_id = document.location.pathname.split("/")[2];

        try {
            const response = await fetch("/api/comments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content, post_id }),
            });

            if (response.ok) {
                document.location.reload();
            } else {
                throw new Error("Comment could not be saved to the post");
            }
        } catch (error) {
            console.error(error.message);
            alert("Something went wrong. Please try again later.");
        }
    }
};

document.querySelector("#postComment").addEventListener("click", postCommentHandler);