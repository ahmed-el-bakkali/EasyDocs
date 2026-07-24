import { supabaseClient } from "../config/supabase.js";
import { showToast } from "../ui/toast.js";
import { getCurrentUser } from "../auth/session.js";
import { resetUploadButton } from "../ui/uploads.js";

export async function loadResources(
    {   schoolId = null,
        yearId = null,
        semesterId = null,
        majorId = null,
        subjectId = null,
        uploaderId = null
    } = {},resourcesContainerEl) {

    if (!resourcesContainerEl) {
        console.error("Resources container was not found.");
        return;
    }

    let query;

    // Profile page: filter directly by uploader
    if (uploaderId) {
        query = supabaseClient.from("resource").select("*").eq("id_uploader", uploaderId);
    }
    // A specific subject is selected
    else if (subjectId) {
        query = supabaseClient.from("resource").select("*").eq("id_subject", subjectId);
    }
    // Academic filters are selected
    else {
        query = supabaseClient.from("resource").select(`*,subjects!inner (id_school,id_year,id_semester,id_major)`);

        if (schoolId) {
            query = query.eq("subjects.id_school", schoolId);
        }

        if (yearId) {
            query = query.eq("subjects.id_year", yearId);
        }

        if (semesterId) {
            query = query.eq("subjects.id_semester", semesterId);
        }

        if (majorId) {
            query = query.eq("subjects.id_major", majorId);
        }
    }

    const { data, error } = await query;

// Always remove the previous results first
resourcesContainerEl.innerHTML = "";

if (error) {
    console.error("Error loading resources:", error);

    resourcesContainerEl.innerHTML = `
        <div class="empty-state">
            <h3>Unable to load resources</h3>
            <p>${error.message}</p>
        </div>
    `;

    return;
}

if (!data || data.length === 0) {
    resourcesContainerEl.innerHTML = `
        <div class="empty-state">
            <h3>No resources found</h3>
            <p>Try selecting different filters.</p>
        </div>
    `;

    return;
}

data.forEach(resource => {
    resourceCardDisplay(resource, resourcesContainerEl);
});
}

/*async function resourceCardDisplay(resource, resourcesContainerEl){
   const {data} = await supabaseClient.from("users").select("username").eq("id_user",resource.id_uploader).single();
    const card = document.createElement("article");
    card.classList.add("resource-card");
    card.innerHTML = `
    <a href = "resource.html?id=${resource.id_resource}">

        <div class="resource-header-card">

            <div class="resource-preview">
                <div class="pdf-icon">PDF</div>
            </div>

        <div class="resource-info">
            <h3>${resource.title}</h3>
            <p>${resource.description || "No description"}</p>     
        </div>
        
        </div>

        <div class="resource-rating">
        
        <div class="stars">
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>     
        </div>

        <span>${resource.average_rating} (${resource.rating_count})</span>

        </div>

        <div class="resource-footer">

            <div class="uploader">
            <img src="assets/default-avatar.jpg" alt="Profile picture">
            <span>${data.username || "unavailable"}</span>
            </div>

        </div>

    </a>`;
    resourcesContainerEl.appendChild(card);}*/

export async function loadTheResource(resourceId, elements) {

    // Getting info

    const { data, error } = await supabaseClient 
    .from("resource") .select("*") .eq("id_resource", resourceId) .single();

    if (error) {
        console.error(error);
        return;
    }

    // Getting resource to display 

    const { data: publicData } = supabaseClient.storage 
    .from("resources_storage") .getPublicUrl(data.file_path);

    const fileUrl = publicData.publicUrl;

    document.getElementById("pdfViewer").src = fileUrl;

    console.log(data);

elements.title.textContent = data.title;

elements.description.textContent = data.description;

elements.fullDescription.textContent = data.description;

elements.fileType.textContent = data.file_type;

elements.fileSize.textContent = `${data.file_size} KB`;

elements.rating.textContent =`${(data.average_rating)} /5`;

elements.averageRating.textContent =`${(data.average_rating)} /5 (${(data.rating_count)})`;

elements.uploadedDate.textContent = new Date(data.added).toLocaleDateString();

elements.commentsCount.textContent = data.comment_count;

elements.downloadsCount.textContent = data.download_count;

elements.views.textContent = `${data.view_count}`;

}


export async function uploadResource(elements) {

    elements.uploadBtn.disabled = true;
    elements.uploadBtn.textContent = "Uploading...";

    const title = elements.titleInput.value.trim();
    const description = elements.descriptionInput.value.trim();
    const schoolId = elements.schoolSelect.value;
    const yearId = elements.yearSelect.value;
    const semesterId = elements.semesterSelect.value;
    const majorId = elements.majorSelect.value;
    const subjectId = elements.subjectSelect.value;
    const file = elements.pdfFile.files[0];
    const user = await getCurrentUser();

    ///////////////// Ensuring user is logged in ////////////

    if(!user){
        showToast("Please log in first.","i");
        resetUploadButton(elements.uploadBtn);
        return;
    }

    ///////////////// ENSURING VALUES /////////////

    if (!title) {
    showToast("Please enter a title.","i");
    resetUploadButton(elements.uploadBtn);
    return;
    }
    if (!subjectId) {
    showToast("Please select a subject.","i");
    resetUploadButton(elements.uploadBtn);
    return;
    }
    if (!file) {
    showToast("Please choose a PDF.","i");
    resetUploadButton(elements.uploadBtn);
    return;
    }
    if (file.type !== "application/pdf") {
    showToast("Only PDF files are allowed.", "warning");
    resetUploadButton(elements.uploadBtn);
    return;
    }
    ////// Creating the intery in resourcz table (Document MetaData) //////////////

    const { data, error } = await supabaseClient
    .from("resource")
    .insert({title : title ,
        description : description ,
        id_subject : subjectId ,
        file_type : 'BLANK',
        file_size : 0,
        average_rating : 0,
        id_uploader : user.id }) .select() .single();

    if (error) {
    console.error(error);
    resetUploadButton(elements.uploadBtn);
    return;}

    const resourceId = data.id_resource;

    /////////////: INSERTING INTO STORAGE ////////////////

    const extension = file.name.split(".").pop().toLowerCase();
    const fileName = `${resourceId}.${extension}`;

    const { error: uploadError } = await supabaseClient.storage
    .from("resources_storage") .upload(fileName, file);

    // if upload error

    if (uploadError) {
    console.error(uploadError);
    await supabaseClient .from("resource") .delete() .eq("id_resource", resourceId);
    showToast("Upload failed.","warning");
    resetUploadButton(elements.uploadBtn)
    return;}

    // if upload succeeds 

    //if(!uploadError){
    const { data: updateData, error: updateError } = await supabaseClient
    .from("resource") .update({file_path: fileName,
                               file_type: extension,
                               file_size: Math.round(file.size / 1024) 
    }) .eq("id_resource", resourceId) .select();

    if (updateError) {
    console.error(updateError);
    resetUploadButton(elements.uploadBtn);
    return;}

    ///////////////// EVERYTHING WENT WELL : message + Go to resource page /////////////////
    
    window.location.href = `resource.html?id=${resourceId}`;
    //}



}

export async function deleteResource(resourceId){

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

export async function rateResource(event, resourceId){
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

// updated RLS so these no longer work, switching to RPC functions 

/*
export async function incDownloadCount(resourceId){

    const{data} = await supabaseClient
            .from("resource").select("download_count").eq("id_resource",resourceId).single();

            const{error : updateDowloadCountError} = await supabaseClient 
            .from("resource").update({download_count : data.download_count + 1 }).eq("id_resource",resourceId);

            if(updateDowloadCountError){
                console.error(updateDowloadCountError);
                return ; 
            }

}

export async function incViewCount(resourceId){

      const{data} = await supabaseClient
            .from("resource").select("view_count").eq("id_resource",resourceId).single();

            const{error : updateViewCountError} = await supabaseClient 
            .from("resource").update({view_count : data.view_count + 1 }).eq("id_resource",resourceId);

            if(updateViewCountError){
                console.error(updateViewCountError);
                return ; 
            }

}*/
async function resourceCardDisplay(resource, resourcesContainerEl){
    console.log(resource);
   const {data} = await supabaseClient.from("users").select("username").eq("id_user",resource.id_uploader).single();
    const card = document.createElement("article");
    card.classList.add("resource-card");

    const starIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`;

    const ratingPct = Math.max(0, Math.min(100, ((resource.average_rating || 0) / 5) * 100));

    card.innerHTML = `
    <a href = "resource.html?id=${resource.id_resource}">

        <div class="resource-header-card">
            <div class="resource-preview">
                <div class="pdf-icon">PDF</div>
            </div>
            <div class="resource-info">
                <h3>${resource.title}</h3>
                <p>${resource.description || "No description provided"}</p>
            </div>
        </div>

        <div class="resource-rating">
            <div class="stars" style="--rating-pct: ${ratingPct}%">
                <div class="stars-bg">${starIcon.repeat(5)}</div>
                <div class="stars-fg">${starIcon.repeat(5)}</div>
            </div>
            <span>${resource.average_rating} (${resource.rating_count})</span>
        </div>

        <div class="resource-footer">
            <div class="uploader">
            <img src="assets/default-avatar.jpg" alt="Profile picture">
            <span>${data.username || "unavailable"}</span>
            </div>
        </div>

    </a>`;
    resourcesContainerEl.appendChild(card);}