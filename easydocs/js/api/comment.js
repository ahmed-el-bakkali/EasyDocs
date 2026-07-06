import { supabaseClient } from "../config/supabase.js";
import { showToast } from "../ui/toast.js";
import { getCurrentUser } from "../auth/session.js";

export async function loadComments(resourceId, commentsReffEl){

    const user = await getCurrentUser();

    const{ data : allComments , error } = await supabaseClient
    .from("comment").select('id_comment, id_user,users(username),content,added')
    .eq("id_resource",resourceId).order("added", { ascending: false });

    if(error){
        console.error(error);
        showToast(error.message,"error");
        return;
    }

    commentsReffEl.innerHTML = "";

    if(allComments.length === 0){ 
        commentsReffEl.innerHTML = '<p>No comments yet :(</p>' 
        return ; 
    };

    allComments.forEach(comment => {

        const isOwner = user && user.id === comment.id_user;

    const card = document.createElement("article");
    card.classList.add("comment-card");

    card.innerHTML = `
    <h4>${comment.users.username}</h4>
    <p>${comment.content}</p>
    <small>${new Date(comment.added).toLocaleDateString()}</small>

    ${isOwner ? `
                    <div class="comment-actions">
                        <button class="edit-comment"
                                data-id="${comment.id_comment}">
                            Edit
                        </button>

                        <button class="delete-comment"
                                data-id="${comment.id_comment}">
                            Delete
                        </button>
                    </div>
                ` : ""}  `;

commentsReffEl.appendChild(card); 

const deleteCommentBtn = card.querySelector(".delete-comment");

if (deleteCommentBtn) {
    deleteCommentBtn.addEventListener("click", (event) => deleteComment(event, resourceId, commentsReffEl));
}

const editCommentBtn = card.querySelector(".edit-comment");

if (editCommentBtn) {
    editCommentBtn.addEventListener("click", (event) => editComment(event, resourceId, commentsReffEl));
}
});
}

export async function postComment(resourceId, commentInputEl, commentsReffEl){

    const user = await getCurrentUser();

    if (!user) {
        showToast("Please login first.","i");
        return;
    }

    const content = commentInputEl.value.trim();

    if (!content) {
    showToast("Comment cannot be empty.","warning");
    return;
    }

    const { error } = await supabaseClient.from("comment").insert({ 
                              content : content,
                              id_user : user.id,
                              id_resource : resourceId 
                            });

        if(error){
            console.error(error);
            return;
        }

    commentInputEl.value = "";

    await loadComments(resourceId, commentsReffEl);

}

export async function editComment(event, resourceId, commentsReffEl) {

    const commentId = event.target.dataset.id;

    const card = event.target.closest(".comment-card");

    const paragraph = card.querySelector("p");

    // First click -> Edit mode
    if (event.target.textContent.trim() === "Edit") {

        paragraph.innerHTML = `
            <textarea class="edit-comment-input">${paragraph.textContent}</textarea>
        `;

        event.target.textContent = "Save";
        return;
    }

    // Second click -> Save
    const newContent = card.querySelector(".edit-comment-input").value.trim();

    if (!newContent) {
        showToast("Comment cannot be empty.","warning");
        return;
    }

    const { error } = await supabaseClient
        .from("comment")
        .update({
            content: newContent
        })
        .eq("id_comment", commentId);

    if (error) {
        console.error(error);
        showToast(error.message,"error");
        return;
    }

    await loadComments(resourceId, commentsReffEl);

}



export async function deleteComment(event, resourceId, commentsReffEl) {

    const commentId = event.target.dataset.id;
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabaseClient
    .from("comment")
    .delete().eq("id_comment", commentId);
    
    if (error) {
        console.error(error);
        showToast(error.message,"error");
        return;
    }
    await loadComments(resourceId, commentsReffEl);
}
