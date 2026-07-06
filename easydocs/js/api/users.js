import { supabaseClient } from "../config/supabase.js";
import { showToast } from "../ui/toast.js";
import { getCurrentUser } from "../auth/session.js";
import { loadYears, loadSemesters, loadMajors } from "./academic.js";

export async function  loadProfile(elements){
const user = await getCurrentUser();
const{ data, error } = await supabaseClient
.from("users").select('*,schools(name_school,abv_school),years(name_year),majors(name_major,code_major)').eq("id_user",user.id).single();
if(error){
    console.error(error);
    showToast(error.message,"error");
    return;
}
console.log(data);
elements.username.textContent = data.username;
elements.email.textContent = user.email;
elements.school.textContent = data.schools.abv_school;
elements.role.textContent = data.role;
elements.joined.textContent =  new Date(user.created_at).toLocaleDateString();
elements.bio.textContent = data.bio;
elements.year.textContent = data.years.name_year ;
elements.major.textContent = data.majors.code_major;
}

export async function loadProfileStats(elements) {
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
    elements.numdowns.textContent = downloads;
    elements.numcmnt.textContent = comments;
    elements.numviews.textContent = views;
    elements.numavgrat.textContent = averageRating.toFixed(1);
    if(uploads == 0){
        const image1 = document.createElement("section");
        image1.classList.add("empty-state-profile");
        elements.resourcesContainer.innerHTML = "";
        image1.innerHTML =  `<br><h2>You haven't uploaded any content yet</h2>
                             <p><span>Share</span> now and <span>help</span> others</p>
                             <br><img src="assets/image1.png" alt="illustartion for profile page"> 
                             `;
        elements.resourcesContainer.appendChild(image1);
    }

}

export async function editProfile(elements) {

    const user = await getCurrentUser();

    const { data, error } = await supabaseClient
    .from("users").select("*").eq("id_user", user.id).single();

    if (error) {
        showToast(error.message, "error");
        return;}

    elements.editUsername.value = data.username;
    elements.editBio.value = data.bio || "";

    elements.yearSelect.innerHTML = '<option value="">Select Year</option>';
    elements.semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    elements.majorSelect.innerHTML = '<option value="">Select Major</option>';

    await loadYears(data.id_school, elements.yearSelect);
    //yearSelect.value = data.user_yearId;
    await loadSemesters(elements.semesterSelect);
    //semesterSelect.value = data.id_semester;
    await loadMajors(elements.yearSelect.value, elements.semesterSelect.value, elements.majorSelect);
    elements.modal.classList.remove("hidden");
}


export async function saveProfile(elements) {
    const user = await getCurrentUser();
    const { error } = await supabaseClient
    .from("users").update({
            username: elements.editUsername.value.trim(),
            user_yearId: elements.yearSelect.value,
            user_majorId: elements.majorSelect.value,
            bio: elements.editBio.value.trim()}).eq("id_user", user.id);

    if (error) {
        console.error(error);
        showToast(error.message, "error");
        return;
    }
    elements.modal.classList.add("hidden");
    showToast("Profile updated!", "success");
    await loadProfile(elements);
}
