import { supabaseClient } from "../config/supabase.js";

export async function loadSchools(schoolSelectEl) {

    const { data, error } = await supabaseClient .from("schools") .select("*");

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(school => {
    const option = document.createElement("option");

    option.value = school.id_school;
    option.textContent = school.abv_school;

    schoolSelectEl.appendChild(option);
    });

}

export async function loadYears(schoolId, yearSelectEl) {

    const { data, error } = await supabaseClient .from("years") .select("*") .eq("id_school", schoolId) .order("order_year",{ ascending : true });

    if (error) {
        console.error(error);
        return;
    }

    yearSelectEl.disabled = false;

    data.forEach(year => {

        const option = document.createElement("option");

        option.value = year.id_year;
        option.textContent = year.name_year;

        yearSelectEl.appendChild(option);

    });

}

export async function loadSemesters(semesterSelectEl) {

    const { data, error } = await supabaseClient .from("semester") .select("*");

    if (error) {
        console.error(error);
        return;
    }

    semesterSelectEl.disabled = false;

    data.forEach(semester => {

        const option = document.createElement("option");

        option.value = semester.id_semester;
        option.textContent = semester.name_semester;

        semesterSelectEl.appendChild(option);

    });

}
export async function loadMajors(yearId, semesterId, majorSelectEl) {

    const { data, error } = await supabaseClient
        .from("program").select(`
            majors (
                id_major,
                name_major
            )
        `).eq("id_year", yearId)
        .eq("id_semester", semesterId);

    if (error) {
        console.error(error);
        return;
    }

    majorSelectEl.innerHTML = '<option value="">Major</option>';
    majorSelectEl.disabled = false;

    data.forEach(program => {

        const option = document.createElement("option");

        option.value = program.majors.id_major;
        option.textContent = program.majors.name_major;

        majorSelectEl.appendChild(option);

    });

}

export async function loadSubjects(schoolId,yearId,majorId,semesterId, subjectSelectEl) {

    const { data, error } = await supabaseClient .from("subjects") .select("*")
    .eq("id_school", schoolId) .eq("id_year", yearId) .eq("id_major", majorId) .eq("id_semester", semesterId);

    if (error) {
        console.error(error);
        return;
    }

    subjectSelectEl.disabled = false;

    data.forEach(subject => {

        const option = document.createElement("option");

        option.value = subject.id_subject;
        option.textContent = subject.name_subject;

        subjectSelectEl.appendChild(option);

    });

}
