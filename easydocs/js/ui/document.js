import { supabaseClient } from "../config/supabase.js";

export async function loadDocInfo(resourceId, elements){

    const { data, error } = await supabaseClient
    .from("resource") .select("subjects(name_subject, years(name_year), schools(abv_school), majors(code_major), semester(name_semester))")
    .eq("id_resource",resourceId) .single();

    if (error) {
        console.error(error);
        return;
    }

   elements.curr_school.textContent = data.subjects.schools.abv_school;
   elements.curr_major.textContent = data.subjects.majors.code_major;
   elements.curr_semester.textContent = data.subjects.semester.name_semester;
   elements.curr_year.textContent = data.subjects.years.name_year;
   elements.curr_subject.textContent = data.subjects.name_subject;

}
