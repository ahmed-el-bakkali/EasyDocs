//////////////////////////////////////////////// Populate schools to select form From Supabase////////////////////////////////////////////////

async function loadSchools() {

    const { data, error } = await supabaseClient .from("schools") .select("*");

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(school => {
    const option = document.createElement("option");

    option.value = school.id_school;
    option.textContent = school.abv_school;

    schoolSelect.appendChild(option);
    });

}

//////////////////////////////////////////////// Populate years to select form From Supabase ////////////////////////////////////////////////

async function loadYears(schoolId) {

    const { data, error } = await supabaseClient .from("years") .select("*") .eq("id_school", schoolId) .order("order_year",{ ascending : true });

    if (error) {
        console.error(error);
        return;
    }

    yearSelect.disabled = false;
  
    data.forEach(year => {

        const option = document.createElement("option");

        option.value = year.id_year;
        option.textContent = year.name_year;

        yearSelect.appendChild(option);

    });

}


////////////////////////////////////////////////// Populate semesters to select form From Supabase ////////////////////////////////////////////////

async function loadSemesters() {

    const { data, error } = await supabaseClient .from("semester") .select("*");

    if (error) {
        console.error(error);
        return;
    }

    semesterSelect.disabled = false;

    data.forEach(semester => {

        const option = document.createElement("option");

        option.value = semester.id_semester;
        option.textContent = semester.name_semester;

        semesterSelect.appendChild(option);

    });

}

////////////////////////////////////////////////// Populate majors to select form From Supabase ////////////////////////////////////////////////

async function loadMajors() {

    const { data, error } = await supabaseClient
        .from("program").select(`
            majors (
                id_major,
                name_major
            )
        `).eq("id_year", yearSelect.value)
        .eq("id_semester", semesterSelect.value);

    if (error) {
        console.error(error);
        return;
    }

    majorSelect.innerHTML = '<option value="">Major</option>';
    majorSelect.disabled = false;

    data.forEach(program => {

        const option = document.createElement("option");

        option.value = program.majors.id_major;
        option.textContent = program.majors.name_major;

        majorSelect.appendChild(option);

    });

}

////////////////////////////////////////////////// Populate subjects to select form From Supabase ////////////////////////////////////////////////

async function loadSubjects(schoolId,yearId,majorId,semesterId) {

    const { data, error } = await supabaseClient .from("subjects") .select("*")
    .eq("id_school", schoolId) .eq("id_year", yearId) .eq("id_major", majorId) .eq("id_semester", semesterId);

    if (error) {
        console.error(error);
        return;
    }

    subjectSelect.disabled = false;

    data.forEach(subject => {

        const option = document.createElement("option");

        option.value = subject.id_subject;
        option.textContent = subject.name_subject;

        subjectSelect.appendChild(option);

    });

}

/////////////////// Function to fetch resource info : school it's from - major it belongs to - it's semester - it's year - it's subject//////////////////////////////////////////////////////

async function loadDocInfo(resourceId){

    const { data, error } = await supabaseClient
    .from("resource") .select("subjects(name_subject, years(name_year), schools(abv_school), majors(code_major), semester(name_semester))")
    .eq("id_resource",resourceId) .single();

    if (error) {
        console.error(error);
        return;
    }

   curr_school.textContent = data.subjects.schools.abv_school;
   curr_major.textContent = data.subjects.majors.code_major;
   curr_semester.textContent = data.subjects.semester.name_semester;
   curr_year.textContent = data.subjects.years.name_year;
   curr_subject.textContent = data.subjects.name_subject;

}
///////////: Function to fetch document to display and it's info : size of of document - it's rating - description - type //////////////////////////////////////////////////

async function loadTheResource(resourceId) {

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

title.textContent = data.title;

description.textContent = data.description;

fullDescription.textContent = data.description;

fileType.textContent = data.file_type;

fileSize.textContent = `${data.file_size} KB`;

rating.textContent =`${(data.average_rating)} /5`;

averageRating.textContent =`${(data.average_rating)} /5 (${(data.rating_count)})`;

uploadedDate.textContent = new Date(data.added).toLocaleDateString();

commentsCount.textContent = data.comment_count;

downloadsCount.textContent = data.download_count;

views.textContent = `${data.view_count}`;

}

/////////////////////////////////////////////////// FUNCTION To Upload file and it's details //////////////////////////////////////////////////

async function uploadResource() {

    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const schoolId = schoolSelect.value;
    const yearId = yearSelect.value;
    const semesterId = semesterSelect.value;
    const majorId = majorSelect.value;
    const subjectId = subjectSelect.value;
    const file = pdfFile.files[0];
    const user = await getCurrentUser();

    ///////////////// Ensuring user is logged in ////////////

    if(!user){
        showToast("Please log in first.","i");
        resetUploadButton();
        return;
    }

    ///////////////// ENSURING VALUES /////////////

    if (!title) {
    showToast("Please enter a title.","i");
    resetUploadButton();
    return;
    }
    if (!subjectId) {
    showToast("Please select a subject.","i");
    resetUploadButton();
    return;
    }
    if (!file) {
    showToast("Please choose a PDF.","i");
    resetUploadButton();
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
    resetUploadButton();
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
    resetUploadButton()
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
    resetUploadButton();
    return;}

    ///////////////// EVERYTHING WENT WELL : message + Go to resource page /////////////////
    
    window.location.href = `resource.html?id=${resourceId}`;
    //}



}

/////////////////: ERROR UPLOADING ///////////////////////////::

function resetUploadButton() {

    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload Resource";

}

///////////////// Function to load the current USER ///////////////////

async function loadCurrentUser() {

    const {data: { user }} = await supabaseClient.auth.getUser();


}

//////////////////// SIGN UP FUNCTION //////////////////////////////

async function signUp(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const schoolId = document.getElementById("school").value;

    if (password !== confirmPassword) {
    showToast("Passwords do not match.","warning");
    return;}

const { data, error } = await supabaseClient.auth.signUp({ email: email, password: password});

if(error){
    console.error(error);
    showToast(error.message,"error");
    return;}

const userId = data.user.id;

const { error : userError } = await supabaseClient 
.from("users").insert({ id_user : userId, username : username, id_school : schoolId});

if(userError){
    console.error(userError);
    showToast(userError.error,"error");
    return;}

 window.location.href = "home.html";

showToast("Account created succesfully! Welcome to MySheet","success");
}

//////////////////////////////////////// Function to LOGIN /////////////////////////////////////////////

async function login(event){

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

        const { data , error} = await 
        supabaseClient.auth.signInWithPassword({ email: email, password: password});

        if(error){
            console.error(error);
            showToast(error.message,"error");
            return;}

            showToast("Welsome back :)","success");
    window.location.href="home.html";
    

}

/////////////////////////////////// Function to get user and return it /////////////////////////////////////////

async function getCurrentUser() {

    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error) {
        console.error(error);
        return null;}

    return user;

}

////////////////// Function to require LOGIN, for ex to access page upload ///////////////////////////////////

async function requireLogin() {

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return false; }

    return true;

}

///////////////////////////////////// Function to logout /////////////////////////////////////

async function logout(event) {

    event.preventDefault();

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error(error);
        showToast(error.message,"error");
        return;
    }

    window.location.href = "home.html";

}

/////////////////::: Function to update navbar ////////////////////////

async function updateNavbar() {

    const user = await getCurrentUser();

    const profileLink = document.getElementById("profileLink");
    const uploadLink = document.getElementById("uploadLink");
    const loginLink = document.getElementById("loginLink");
    const signupLink = document.getElementById("signupLink");
    const logoutLink = document.getElementById("logoutBtn");

    if (user) {

        if (profileLink) profileLink.style.display = "";
        if (uploadLink) uploadLink.style.display = "";
        if (logoutLink) {
            logoutLink.style.display = "";
            logoutLink.addEventListener("click", logout);}
        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";

    }

    else {

        if (profileLink) profileLink.style.display = "none";
        if (uploadLink) uploadLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
        if (loginLink) loginLink.style.display = "";
        if (signupLink) signupLink.style.display = "";

    }

}

//////////////////////////////// Notifications ////////////////////////////////

function showToast(message, type = "info") {

    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");

    toast.classList.add("toast", type);

    let icon = "";

    switch(type){

        case "success":
            icon = "✓";
            break;

        case "error":
            icon = "✕";
            break;

        case "warning":
            icon = "⚠";
            break;

        default:
            icon = "ℹ";

    }

    toast.innerHTML = `
        <strong>${icon}</strong>
        ${message}
    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {

            toast.remove();

        },5000);

    },3000);

}

async function loadResources({  schoolId = null,
                                yearId = null,
                                semesterId = null,
                                majorId = null,
                                subjectId = null,
                                uploaderId = null} = {})    {

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

    resourcesContainer.innerHTML = "";

    if (data.length === 0) {
        resourcesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No resources found</h3>
                <p>---</p>
            </div>
        `;
        return;
    }

     data.forEach(resource => { resourceCardDisplay(resource); } );
    
    }

        // display card for info function 

async function resourceCardDisplay(resource){
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
    resourcesContainer.appendChild(card);}