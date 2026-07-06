console.log("JS LOADED");

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

const resourceElements = {
    title, description, fullDescription, fileType, fileSize, rating,
    averageRating, uploadedDate, commentsCount, downloadsCount, views
};

const docElements = { curr_school, curr_year, curr_semester, curr_major, curr_subject };

import { supabaseClient } from "../config/supabase.js";
import { getCurrentUser } from "../auth/session.js";
import { logout } from "../auth/auth.js";
import { updateNavbar } from "../auth/navbar.js";

import {loadTheResource, rateResource,incDownloadCount,incViewCount,deleteResource
} from "../api/resources.js";

import {loadComments, postComment
} from "../api/comment.js";

import { loadDocInfo } from "../ui/document.js";

import { showToast } from "../ui/toast.js";


initResourcePage();

async function initResourcePage() {
    const user = await getCurrentUser();
    await updateNavbar();
    await loadDocInfo(resourceId, docElements);
    await loadTheResource(resourceId, resourceElements);
    await loadComments(resourceId, commentsReff);

    // just to protect from incing at every refresh
    if (!sessionStorage.getItem(`viewed-${resourceId}`)) {
    await incViewCount(resourceId);
    sessionStorage.setItem(`viewed-${resourceId}`, "true");
}

    commentBtn.addEventListener("click", () => postComment(resourceId, commentInput, commentsReff));

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

    deleteBtn.addEventListener("click", () => deleteResource(resourceId));

    stars.forEach(star => {star.addEventListener("click", (event) => rateResource(event, resourceId));});
}
