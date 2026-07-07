import { supabaseClient } from "../config/supabase.js";
import { showToast } from "../ui/toast.js";
import { getCurrentUser } from "../auth/session.js";
import { resetUploadButton } from "../ui/uploads.js";

export async function loadResources({   schoolId = null,
                                        yearId = null,
                                        semesterId = null,
                                        majorId = null,
                                        subjectId = null,
                                        uploaderId = null} = {},
                                        resourcesContainerEl)    {

        let query = supabaseClient.from("resource") ;

    if (schoolId && !yearId && !semesterId && !majorId && !subjectId && !uploaderId) { //for only schoolid
        query = query.select(`*,subjects!inner (id_school)`)
                     .eq("subjects.id_school", schoolId);
    }

    if (!schoolId && yearId && !semesterId && !majorId && !subjectId && !uploaderId) { // for only yearId
        query = query.select(`*,subjects!inner (id_year)`)
                     .eq("subjects.id_year", yearId);
    }

    if (!schoolId && yearId && semesterId && !majorId && !subjectId && !uploaderId) { // for year&semesterId
        query = query.select(`*,subjects!inner(id_year, id_semester )`)
                     .eq("subjects.id_year", yearId).eq("subjects.id_semester", semesterId);
    }

    if (!schoolId && !yearId && !semesterId && majorId && !subjectId && !uploaderId) { // for majorId
        query = query.select(`*,subjects!inner (id_major)`).eq("subjects.id_major", majorId);
    }

    if (!schoolId && !yearId && !semesterId && !majorId && subjectId && !uploaderId) { // for subjectId
        query = query.select("*") .eq("id_subject", subjectId);
    }

    if (!schoolId && !yearId && !semesterId && !majorId && !subjectId && uploaderId) { // for IploaderId
        query = query.select('*').eq("id_uploader",uploaderId);}

    const { data, error } = await query;

    if (error) {
        console.error(error);
        showToast(error.message, "error");
        return;
    }

    resourcesContainerEl.innerHTML = "";

    if (data.length === 0) {
        resourcesContainerEl.innerHTML = `
            <div class="empty-state">
                <h3>No resources found</h3>
                <p>---</p>
            </div>
        `;
        return;
    }

     data.forEach(resource => { resourceCardDisplay(resource, resourcesContainerEl); } );

    }

async function resourceCardDisplay(resource, resourcesContainerEl){
    const card = document.createElement("article");
    card.classList.add("resource-card");
    card.innerHTML = `
        <div class="resource-main">
            <h3>${resource.title}</h3>
            <p>
                ${resource.description || "No description"}
            </p>       
        </div>
        <div class="resource-actions">
            <a href="resource.html?id=${resource.id_resource}">View     </a>
            <p><svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>${Number(resource.average_rating).toFixed(1)} (${resource.rating_count})</p>
                    <div class="resource-stats">
                    <p><svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg> ${resource.download_count}</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-icon lucide-message-circle"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg> ${resource.comment_count}</p>
                    <p><svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg> ${resource.view_count}</p>
                </div>
        </div>`;
    resourcesContainerEl.appendChild(card);}

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
