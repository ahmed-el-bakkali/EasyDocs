import { supabaseClient } from "../config/supabase.js";
import { getCurrentUser } from "../auth/session.js";
import { updateNavbar } from "../auth/navbar.js";

import {loadSchools,loadYears,loadSemesters,loadMajors,loadSubjects} from "../api/academic.js";
import { loadResources } from "../api/resources.js";

initHomePage();

async function initHomePage() {

    // These IDs match your actual index.html
    const schoolSelect = document.getElementById("school");
    const yearSelect = document.getElementById("year");
    const semesterSelect = document.getElementById("semester");
    const majorSelect = document.getElementById("major");
    const subjectSelect = document.getElementById("subject");
    const resourcesContainer = document.getElementById("resources");
    const hiddenWhenLogged = document.getElementById("content-1");

    // Check that the required elements exist
    if (!schoolSelect ||!yearSelect ||!semesterSelect ||!majorSelect ||!subjectSelect ||!resourcesContainer) {
        console.error("One or more home-page elements were not found.");
        return;
    }

    // Load navbar
    await updateNavbar();

    // Load the schools immediately
    await loadSchools(schoolSelect);

    // Welcome message
    const user = await getCurrentUser();

    if (user && hiddenWhenLogged) {
        const { data, error } = await supabaseClient.from("users").select("username").eq("id_user", user.id).single();
        if (error) {
            console.error("Error loading username:", error);
        } else {
            hiddenWhenLogged.innerHTML = `<h2>Welcome back ${data?.username || "User"}</h2>`;
        }}
    // SCHOOL
    schoolSelect.addEventListener("change", async () => {
        yearSelect.innerHTML = '<option value="">Year</option>';
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';

        yearSelect.disabled = true;
        semesterSelect.disabled = true;
        majorSelect.disabled = true;
        subjectSelect.disabled = true;

        if (!schoolSelect.value) {
            resourcesContainer.innerHTML = "";
            return;
        }

        await loadYears(
            schoolSelect.value,
            yearSelect
        );
        await loadResources({schoolId: schoolSelect.value},resourcesContainer);
    });

    // YEAR
    yearSelect.addEventListener("change", async () => {
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        semesterSelect.disabled = true;
        majorSelect.disabled = true;
        subjectSelect.disabled = true;
        if (!yearSelect.value) {
            await loadResources({schoolId: schoolSelect.value},resourcesContainer);
            return;}
        await loadSemesters(semesterSelect);
        await loadResources({schoolId: schoolSelect.value,yearId: yearSelect.value},resourcesContainer);});

    // SEMESTER
    semesterSelect.addEventListener("change", async () => {
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        majorSelect.disabled = true;
        subjectSelect.disabled = true
        if (!semesterSelect.value) {
            await loadResources({schoolId: schoolSelect.value,yearId: yearSelect.value},resourcesContainer);
            return;}
        await loadMajors(yearSelect.value,semesterSelect.value,majorSelect);
        await loadResources({schoolId: schoolSelect.value,yearId: yearSelect.value,semesterId: semesterSelect.value},resourcesContainer);});
    // MAJOR
    majorSelect.addEventListener("change", async () => {
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        subjectSelect.disabled = true;
        if (!majorSelect.value) {await loadResources({schoolId: schoolSelect.value,yearId: yearSelect.value,semesterId: semesterSelect.value},resourcesContainer);
            return;}
        await loadSubjects(schoolSelect.value, yearSelect.value,majorSelect.value, semesterSelect.value,subjectSelect);
        await loadResources( {schoolId: schoolSelect.value,yearId: yearSelect.value,semesterId: semesterSelect.value,majorId: majorSelect.value},resourcesContainer);});
    // SUBJECT
    subjectSelect.addEventListener("change", async () => {
        if (!subjectSelect.value) {await loadResources({schoolId: schoolSelect.value,yearId: yearSelect.value,semesterId: semesterSelect.value,majorId: majorSelect.value},resourcesContainer);
            return;  }
        await loadResources({schoolId: schoolSelect.value,yearId: yearSelect.value,semesterId: semesterSelect.value,majorId: majorSelect.value,subjectId: subjectSelect.value},resourcesContainer);});
}