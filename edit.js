console.log("JS LOADED");
console.log(supabaseClient);

const params = new URLSearchParams(window.location.search);
const resourceId = params.get("id");

// DOM Elements
const logoutBtn = document.getElementById("logoutBtn");
const saveBtn = document.getElementById("saveBtn");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");

const schoolSelect = document.getElementById("school");
const yearSelect = document.getElementById("year");
const semesterSelect = document.getElementById("semester");
const majorSelect = document.getElementById("major");
const subjectSelect = document.getElementById("subject");

initEditPage();

async function initEditPage() {

    await updateNavbar();

    if (!await requireLogin()) return;

    await loadSchools();

    await loadResourceToEdit();

    registerEventListeners();

}

function registerEventListeners() {

    schoolSelect.addEventListener("change", async () => {

        yearSelect.innerHTML = '<option value="">Year</option>';
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';

        await loadYears(schoolSelect.value);

    });

    yearSelect.addEventListener("change", async () => {

        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';

        await loadSemesters();

    });

    semesterSelect.addEventListener("change", async () => {

        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';

        await loadMajors(schoolSelect.value);

    });

    majorSelect.addEventListener("change", async () => {

        subjectSelect.innerHTML = '<option value="">Subject</option>';

        await loadSubjects(
            schoolSelect.value,
            yearSelect.value,
            majorSelect.value,
            semesterSelect.value
        );

    });

    saveBtn.addEventListener("click", saveChanges);

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

}


async function loadResourceToEdit() {

    const { data, error } = await supabaseClient
        .from("resource")
        .select(`
            title,
            description,
            id_subject,
            subjects(
                id_subject,
                id_school,
                id_year,
                id_major,
                id_semester
            )
        `)
        .eq("id_resource", resourceId)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    titleInput.value = data.title;
    descriptionInput.value = data.description;

    schoolSelect.value = data.subjects.id_school;

    await loadYears(data.subjects.id_school);
    yearSelect.value = data.subjects.id_year;

    await loadSemesters();
    semesterSelect.value = data.subjects.id_semester;

    await loadMajors(data.subjects.id_school);
    majorSelect.value = data.subjects.id_major;

    await loadSubjects(
        data.subjects.id_school,
        data.subjects.id_year,
        data.subjects.id_major,
        data.subjects.id_semester
    );

    subjectSelect.value = data.id_subject;

}

async function saveChanges(event) {

    event.preventDefault();

    const { error } = await supabaseClient
        .from("resource")
        .update({
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            id_subject: subjectSelect.value
        })
        .eq("id_resource", resourceId);

    if (error) {
        console.error(error);
        showToast(error.message,"error");
        return;
    }

    window.location.href = `resource.html?id=${resourceId}`;

}