console.log(supabaseClient);
console.log("JS LOADED");

const logoutBtn = document.getElementById("logoutBtn");
const schoolSelect = document.getElementById("school");
const yearSelect = document.getElementById("year");
const majorSelect = document.getElementById("major");
const semesterSelect = document.getElementById("semester");
const subjectSelect = document.getElementById("subject");
const resourcesContainer = document.getElementById("resources");
const hiddenWhenLogged = document.getElementById("content-1");

import { supabaseClient } from "../config/supabase.js";
import { getCurrentUser } from "../auth/session.js";
import { logout } from "../auth/auth.js";
import { updateNavbar } from "../auth/navbar.js";
import { loadSchools,loadYears,loadSemesters,loadMajors,loadSubjects } from "../api/academic.js";
import { loadResources } from "../api/resources.js";
import { showToast } from "../ui/toast.js";

initHomePage();

async function initHomePage() {
    const user = await getCurrentUser();
    if(user){
        const {data , error} = await supabaseClient
        .from("users").select("username").eq("id_user",user.id).single();
        hiddenWhenLogged.innerHTML="";
        hiddenWhenLogged.innerHTML = `<h2>Welcome back ${data.username}</h2>`;
    }
    await updateNavbar();
    await loadSchools(schoolSelect);
    schoolSelect.addEventListener("change", () => {
        loadResources({schoolId : schoolSelect.value}, resourcesContainer);
        yearSelect.innerHTML = '<option value="">Year</option>';
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadYears(schoolSelect.value, yearSelect);
    });
    yearSelect.addEventListener("change", () => {
        loadResources({yearId : yearSelect.value}, resourcesContainer);
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadSemesters(semesterSelect);
    });
    semesterSelect.addEventListener("change", () => {
        loadResources({yearId : yearSelect.value,
                       semesterId : semesterSelect.value
                      }, resourcesContainer);
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadMajors(yearSelect.value, semesterSelect.value, majorSelect);
    });
    majorSelect.addEventListener("change", () => {
        loadResources({ yearId : yearSelect.value,
                        majorId : majorSelect.value,
                        semesterId : semesterSelect.value
                        }, resourcesContainer);
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadSubjects(schoolSelect.value,yearSelect.value,majorSelect.value,semesterSelect.value, subjectSelect);
    });
    subjectSelect.addEventListener("change", () => {
        loadResources({subjectId : subjectSelect.value}, resourcesContainer);
    });
    if (logoutBtn) { logoutBtn.addEventListener("click", logout);}
}