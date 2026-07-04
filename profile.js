console.log("JS LOADED");
console.log(supabaseClient);

const username = document.getElementById("nameProfile");
const email = document.getElementById("profileEmail");
const school = document.getElementById("profileSchool");
const major = document.getElementById("profileMajor");
const role = document.getElementById("role");
const joined = document.getElementById("joined");
const resourcesContainer =document.getElementById("resources");
const bio = document.getElementById("profileBio");
const profile = document.getElementById("profile-section");
const year = document.getElementById("profileYear");

//const numups =  document.getElementById("uploadsNumber");

const numdowns =  document.getElementById("downloadsNumber");
const numcmnt =  document.getElementById("commentsNumber");
const numavgrat =  document.getElementById("averageRatingNumber"); 
const numviews = document.getElementById("viewsNumber");
const editBtn = document.getElementById("editProfile");

const modal = document.getElementById("editProfileModal");

const editUsername = document.getElementById("editUsername");
const yearSelect = document.getElementById("yearSelect");
const semesterSelect = document.getElementById("semesterSelect");
const majorSelect = document.getElementById("majorSelect");
const editBio = document.getElementById("editBio");

const cancelEditBtn = document.getElementById("cancelEditBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");



initProfilePage();

async function initProfilePage() {
    const user = await getCurrentUser();
    await updateNavbar();
    if (!await requireLogin()) return;
        await loadProfile();
        await loadResources({uploaderId : user.id });
        loadProfileStats();
        editBtn.addEventListener("click", editProfile);

    

    yearSelect.addEventListener("change", async () => {
    semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    majorSelect.innerHTML = '<option value="">Select Major</option>';
    await loadSemesters();});

    semesterSelect.addEventListener("change", async () => {
    majorSelect.innerHTML = '<option value="">Select Major</option>';
    await loadMajors();});

    saveProfileBtn.addEventListener("click", saveProfile);
    cancelEditBtn.addEventListener("click", () => {
    modal.classList.add("hidden");});
    }

// getting current user info to diplay on card

async function  loadProfile(){
const user = await getCurrentUser();
const{ data, error } = await supabaseClient
.from("users").select('*,schools(name_school,abv_school),years(name_year),majors(name_major,code_major)').eq("id_user",user.id).single();
if(error){
    console.error(error);
    showToast(error.message,"error");
    return;
}
console.log(data);
username.textContent = data.username;
email.textContent = user.email;
school.textContent = data.schools.abv_school;
role.textContent = data.role;
joined.textContent =  new Date(user.created_at).toLocaleDateString();
bio.textContent = data.bio;
year.textContent = data.years.name_year ;
major.textContent = data.majors.code_major;
}

async function loadProfileStats() {
    const user = await getCurrentUser();
    const { data, error } = await supabaseClient
        .from("resource")
        .select("average_rating, download_count, comment_count, view_count")
        .eq("id_uploader", user.id);
    if (error) {
        console.error(error);
        showToast(error.message, "error");
        return;
    }
    const uploads = data.length;
    const downloads = data.reduce((sum, resource) => sum + resource.download_count,0);
    const comments = data.reduce((sum, resource) => sum + resource.comment_count,0);
    const views = data.reduce((sum, resource) => sum + resource.view_count,0);
    const averageRating = uploads === 0? 0: data.reduce((sum, resource) => sum + resource.average_rating,0 ) / uploads;
    //numups.textContent = uploads;
    numdowns.textContent = downloads;
    numcmnt.textContent = comments;
    numviews.textContent = views;
    numavgrat.textContent = averageRating.toFixed(1);
    if(uploads == 0){
        const image1 = document.createElement("section");
        image1.classList.add("empty-state-profile");
        resourcesContainer.innerHTML = "";
        image1.innerHTML =  `<br><h2>You haven't uploaded any content yet</h2>
                             <p><span>Share</span> now and <span>help</span> others</p>
                             <br><img src="image1.png" alt="illustartion for profile page"> 
                             `;
        resourcesContainer.appendChild(image1);
    }

}

async function editProfile() {

    const user = await getCurrentUser();

    const { data, error } = await supabaseClient
    .from("users").select("*").eq("id_user", user.id).single();

    if (error) {
        showToast(error.message, "error");
        return;}

    editUsername.value = data.username;
    editBio.value = data.bio || "";

    yearSelect.innerHTML = '<option value="">Select Year</option>';
    semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    majorSelect.innerHTML = '<option value="">Select Major</option>';

    await loadYears(data.id_school);
    //yearSelect.value = data.user_yearId;
    await loadSemesters();
    //semesterSelect.value = data.id_semester;
    await loadMajors();
    modal.classList.remove("hidden");
}


async function saveProfile() {
    const user = await getCurrentUser();
    const { error } = await supabaseClient
    .from("users").update({
            username: editUsername.value.trim(),
            user_yearId: yearSelect.value,
            user_majorId: majorSelect.value,
            bio: editBio.value.trim()}).eq("id_user", user.id);

    if (error) {
        console.error(error);
        showToast(error.message, "error");
        return;
    }
    modal.classList.add("hidden");
    showToast("Profile updated!", "success");
    await loadProfile();
}