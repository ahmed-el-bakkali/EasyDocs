console.log("JS LOADED");
console.log(supabaseClient);

// params gets current page url that we've previously iserted document id in 
const params = new URLSearchParams(window.location.search);
// resourceId gets that id from URL
const resourceId = params.get("id");

const logoutBtn = document.getElementById("logoutBtn");
const title = document.getElementById("title");
const description = document.getElementById("description");
const fullDescription = document.getElementById("fullDescription");
const fileType = document.getElementById("fileType");
const fileSize = document.getElementById("fileSize");
const rating = document.getElementById("rating");
const averageRating = document.getElementById("averageRating");
const uploadedDate = document.getElementById("uploadedDate");
const downloadBtn = document.getElementById("downloadBtn");
const curr_school = document.getElementById("school");
const curr_year = document.getElementById("year");
const curr_semester = document.getElementById("semester");
const curr_major = document.getElementById("major");
const curr_subject = document.getElementById("subject");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const stars = document.querySelectorAll("button.star");
const commentsReff = document.getElementById("comment");
const commentInput = document.getElementById("commentInput");
const commentBtn = document.getElementById("commentBtn");
const downloadsCount = document.getElementById("downloadsCount");
const views = document.getElementById("views");
const commentsCount = document.getElementById("commentsCount");


initResourcePage();

async function initResourcePage() {
    const user = await getCurrentUser();
    await updateNavbar();
    await loadDocInfo(resourceId);
    await loadTheResource(resourceId);
    await loadComments(resourceId);

    // just to protect from incing at every refresh
    if (!sessionStorage.getItem(`viewed-${resourceId}`)) {
    await incViewCount(resourceId);
    sessionStorage.setItem(`viewed-${resourceId}`, "true");
}

    commentBtn.addEventListener("click", postComment);

    if (logoutBtn) {logoutBtn.addEventListener("click", logout);}

    downloadBtn.addEventListener("click", () => {
         incDownloadCount(resourceId);
        window.open(document.getElementById("pdfViewer").src, "_blank");});

    const {data, error} = await supabaseClient
    .from("resource").select("id_uploader").eq("id_resource",resourceId).single();

    if(error){
        console.error(error);
        return;}

    if (user && user.id === data.id_uploader) {
        editBtn.style.display = "";
        deleteBtn.style.display = "";}

    editBtn.addEventListener("click", () => {
        window.location.href = `edit.html?id=${resourceId}`;});

    deleteBtn.addEventListener("click", deleteResource);

    stars.forEach(star => {star.addEventListener("click", rateResource);});
}


async function deleteResource(){

    //1.confirm deletion
    if (!confirm("Are you sure you want to delete this resource?")) {
        return;
    }

    //2.get file_path from resource table before deleting it
    const { data , error : findPathError } = await supabaseClient
    .from("resource").select("file_path")
    .eq("id_resource", resourceId).single();

    if (findPathError) {
    console.error(findPathError);
    showToast(findPathError.message,"error");
    return;
    }

    //3.delete row from resource table
    const {error: deleteResourceError} = await supabaseClient
    .from("resource").delete().eq("id_resource",resourceId);
    
    if ( deleteResourceError) {
    console.error( deleteResourceError);
    showToast( deleteResourceError.message,"error");
    return;
    }

    //4.delete document from storage
    const { error: storageError } =await supabaseClient.storage
    .from("resources_storage").remove(data.file_path);

    if (storageError) {
    console.error(storageError);
    showToast(storageError.message,"error");
    return;
    }
    
    //5.if succeeds message + redirect
    showToast("Resource deleted succesfully,","success");
    window.location.href="profile.html";

}

async function rateResource(event){
console.log(event.currentTarget);

const score = Number(event.currentTarget.dataset.score);
const user = await getCurrentUser();

    if(!user){
        showToast("Please login first.","i");
        return;
    }

    const { data } = await supabaseClient
    .from("rating").select("*").eq("id_user", user.id)
    .eq("id_resource", resourceId).single();

    console.log("Updating score:", score, typeof score);

    if(data){
        const { data : updatedRating, error : updateError} = await supabaseClient
        .from("rating").update({score : score}).eq("id_rating",data.id_rating);
    
        console.log(updatedRating);

        if (updateError) {
        console.error(updateError);
        showToast(updateError.message,"error");
        return;}
    }

    if(!data){
        console.log("Inserting:", {
    id_user: user.id,
    id_resource: resourceId,
    score: score});
         const { error: insertError } = await supabaseClient.from("rating")
        .insert({id_user: user.id,id_resource: resourceId,score: score});

        if (insertError) {
            console.error(insertError);
            showToast(insertError.message,"error");
            return;
        }
    }

    showToast("Your rating was recorded","success");
}

//Function to load Comments 

async function loadComments(resourceId){

    const user = await getCurrentUser();

    const{ data : allComments , error } = await supabaseClient
    .from("comment").select('id_comment, id_user,users(username),content,added')
    .eq("id_resource",resourceId).order("added", { ascending: false });

    if(error){
        console.error(error);
        showToast(error.message,"error");
        return;
    }

    commentsReff.innerHTML = "";

    if(allComments.length === 0){ 
        commentsReff.innerHTML = '<p>No comments yet :(</p>' 
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

commentsReff.appendChild(card); 

const deleteCommentBtn = card.querySelector(".delete-comment");

if (deleteCommentBtn) {
    deleteCommentBtn.addEventListener("click", deleteComment);
}

const editCommentBtn = card.querySelector(".edit-comment");

if (editCommentBtn) {
    editCommentBtn.addEventListener("click", editComment);
}

});

}

// Function to write comments 

async function postComment(){

    const user = await getCurrentUser();

    if (!user) {
        showToast("Please login first.","i");
        return;
    }

    const content = commentInput.value.trim();

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

    commentInput.value = "";

    await loadComments(resourceId);

}


async function deleteComment(event) {

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
    await loadComments(resourceId);
}

// edit function

async function editComment(event) {

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

    await loadComments(resourceId);

}

async function incDownloadCount(resourceId){

    const{data} = await supabaseClient
            .from("resource").select("download_count").eq("id_resource",resourceId).single();

            const{error : updateDowloadCountError} = await supabaseClient 
            .from("resource").update({download_count : data.download_count + 1 }).eq("id_resource",resourceId);

            if(updateDowloadCountError){
                console.error(updateDowloadCountError);
                return ; 
            }

}

async function incViewCount(resourceId){

      const{data} = await supabaseClient
            .from("resource").select("view_count").eq("id_resource",resourceId).single();

            const{error : updateViewCountError} = await supabaseClient 
            .from("resource").update({view_count : data.view_count + 1 }).eq("id_resource",resourceId);

            if(updateViewCountError){
                console.error(updateViewCountError);
                return ; 
            }

}