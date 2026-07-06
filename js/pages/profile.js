console.log("JS LOADED");

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

// Bundled together since the profile/edit-profile functions all need a mix of these
const elements = {
    username, email, school, major, role, joined, bio, year,
    resourcesContainer,
    numdowns, numcmnt, numavgrat, numviews,
    modal, editUsername, yearSelect, semesterSelect, majorSelect, editBio
};

import { getCurrentUser, requireLogin } from "../auth/session.js";
import { updateNavbar } from "../auth/navbar.js";

import { loadSemesters, loadMajors } from "../api/academic.js";
import { loadResources } from "../api/resources.js";

import {loadProfile,loadProfileStats,editProfile,saveProfile
} from "../api/users.js";

import { showToast } from "../ui/toast.js";

initProfilePage();

async function initProfilePage() {
    const user = await getCurrentUser();
    await updateNavbar();
    if (!await requireLogin()) return;
        await loadProfile(elements);
        await loadResources({uploaderId : user.id }, resourcesContainer);
        loadProfileStats(elements);
        editBtn.addEventListener("click", () => editProfile(elements));

    

    yearSelect.addEventListener("change", async () => {
    semesterSelect.innerHTML = '<option value="">Select Semester</option>';
    majorSelect.innerHTML = '<option value="">Select Major</option>';
    await loadSemesters(semesterSelect);});

    semesterSelect.addEventListener("change", async () => {
    majorSelect.innerHTML = '<option value="">Select Major</option>';
    await loadMajors(yearSelect.value, semesterSelect.value, majorSelect);});

    saveProfileBtn.addEventListener("click", () => saveProfile(elements));
    cancelEditBtn.addEventListener("click", () => {
    modal.classList.add("hidden");});
    }
