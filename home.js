console.log("JS LOADED");
console.log(supabaseClient);

const logoutBtn = document.getElementById("logoutBtn");
const schoolSelect = document.getElementById("school");
const yearSelect = document.getElementById("year");
const majorSelect = document.getElementById("major");
const semesterSelect = document.getElementById("semester");
const subjectSelect = document.getElementById("subject");
const resourcesContainer = document.getElementById("resources");
const hiddenWhenLogged = document.getElementById("content-1")


initHomePage();

async function initHomePage() {

    const user = await getCurrentUser();
    console.log(user);

    if(user){
        const {data , error} = await supabaseClient.from("users").select("username").eq("id_user",user.id).single();
        hiddenWhenLogged.innerHTML="";
        hiddenWhenLogged.innerHTML = `<h2>Welcome back ${data.username}</h2>`;
    }

    
    await updateNavbar();
    await loadSchools(); 
    schoolSelect.addEventListener("change", () => {
        loadResources({schoolId : schoolSelect.value});
        yearSelect.innerHTML = '<option value="">Year</option>';
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadYears(schoolSelect.value);
    });


    yearSelect.addEventListener("change", () => {
        loadResources({yearId : yearSelect.value});
        semesterSelect.innerHTML = '<option value="">Semester</option>';
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadSemesters();
    });


    semesterSelect.addEventListener("change", () => {
        loadResources({yearId : yearSelect.value,
                       semesterId : semesterSelect.value
        });
        majorSelect.innerHTML = '<option value="">Major</option>';
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadMajors(schoolSelect.value);
    });

    
    majorSelect.addEventListener("change", () => {
        loadResources({majorId : majorSelect.value});
        subjectSelect.innerHTML = '<option value="">Subject</option>';
        loadSubjects(schoolSelect.value,yearSelect.value,majorSelect.value,semesterSelect.value);
    });


    subjectSelect.addEventListener("change", () => {
        loadResources({subjectId : subjectSelect.value});
    });


    if (logoutBtn) { logoutBtn.addEventListener("click", logout);}
}
