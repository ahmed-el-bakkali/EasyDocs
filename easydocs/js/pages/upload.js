console.log("JS LOADED");

const logoutBtn = document.getElementById("logoutBtn");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const schoolSelect = document.getElementById("school");
const yearSelect = document.getElementById("year");
const semesterSelect = document.getElementById("semester");
const majorSelect = document.getElementById("major");
const subjectSelect = document.getElementById("subject");
const pdfFile = document.getElementById("pdfFile");
const uploadBtn = document.getElementById("uploadBtn");
const selectedFile = document.getElementById("selectedFile");
const chooseFileBtn = document.getElementById("chooseFileBtn");

import { requireLogin } from "../auth/session.js";
import { updateNavbar } from "../auth/navbar.js";
import { logout } from "../auth/auth.js";

import {loadSchools,loadYears,loadMajors,loadSemesters,loadSubjects
} from "../api/academic.js";

import { uploadResource } from "../api/resources.js";

import { showToast } from "../ui/toast.js";
import { resetUploadButton } from "../ui/uploads.js";

initUploadPage();

async function initUploadPage() {
    await updateNavbar();
    if (!await requireLogin()) return;
    await loadSchools(schoolSelect);
    registerEventListeners();
}

function registerEventListeners() {

    // School selected -> load years
    schoolSelect.addEventListener("change", () => {
        yearSelect.innerHTML = '<option value="">Year</option>';
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadYears(schoolSelect.value, yearSelect);
    });

    // Year selected -> load semesters
    yearSelect.addEventListener("change", () => {
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadSemesters(semesterSelect);
    });

    // Semester selected -> load majors
    semesterSelect.addEventListener("change", () => {
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadMajors(yearSelect.value, semesterSelect.value, majorSelect);
    });

    // Major selected -> load subjects
    majorSelect.addEventListener("change", () => {
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadSubjects(schoolSelect.value,yearSelect.value,majorSelect.value,semesterSelect.value, subjectSelect);
    });

    // Upload button
    uploadBtn.addEventListener("click", () => {
        uploadResource({
            uploadBtn,
            titleInput,
            descriptionInput,
            schoolSelect,
            yearSelect,
            semesterSelect,
            majorSelect,
            subjectSelect,
            pdfFile
        });
    });

    // Choose file button
    chooseFileBtn.addEventListener("click", () => {

        pdfFile.click();
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
//indicating that a file has been selected 
    pdfFile.addEventListener("change", () => {
    if (pdfFile.files.length > 0) {
        selectedFile.textContent = `✓ ${pdfFile.files[0].name}`;
        selectedFile.classList.add("file-selected");
    } else {
        selectedFile.textContent = "No file selected";
        selectedFile.classList.remove("file-selected");
    }
    });

}
