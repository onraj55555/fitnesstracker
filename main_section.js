import { view_section, main_section } from "./view.js";
import { get_supabase_client } from "./login_section.js";

let supabase = null

async function init_main_section() {
    console.log("Init main section");
    supabase = get_supabase_client();
    view_section(main_section);
    let data = await get_all_muscle_groups();
    render_all_muscle_groups(data);
    await get_last_workouts(data);
}

async function get_all_muscle_groups() {
    const {data, error} = await supabase
        .from('musclegroups')
        .select();
    
    if(error != null) {
        console.log(error);
        error("An error occured, check the console")
        return null;
    }

    console.log(data);

    return data;
}

function render_all_muscle_groups(data) {
    let musclegroups_dropdown = document.getElementById("musclegroups_dropdown");

    while(musclegroups_dropdown.firstChild) {
        musclegroups_dropdown.firstChild.remove();
    }

    for(let i of data) {
        let option = document.createElement("option");
        option.value = i.name;
        option.innerHTML = i.name;
        musclegroups_dropdown.appendChild(option);
    }
}

async function enter_new_musclegroup() {
    console.log("Entering new musclegroup")
    let new_musclegroup = document.getElementById("new_musclegroup").value;
    let new_musclegroup_description = document.getElementById("new_musclegroup_description").value;

    console.log(new_musclegroup, new_musclegroup_description);

    if(new_musclegroup == '') return;

    const { error } = await supabase
        .from('musclegroups')
        .insert({name: new_musclegroup, description: new_musclegroup_description});

    if(error != null) {
        error("An error occured trying to add a new musclegroup, check console");
        console.log(error);
        return;
    }

    await init_main_section();
}

async function submit_workout() {
    let selected_musclegroup = document.getElementById("musclegroups_dropdown").value;

    let description = document.getElementById("workout_description").value;

    if(description == "") {
        alert("Nothing entered, nothing changed!");
        return;
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const { error } = await supabase
        .from('workout_entries')
        .insert({ type: selected_musclegroup, date: today, description: description });
    
    if(error != null) {
        console.log(error);
    } else {
        console.log("Success!")
    }

}

async function get_last_workouts(muscle_groups) {
    console.log("Getting last workouts");

    let last_workouts_div = document.getElementById("last_workouts");

    for(let i of muscle_groups) {
        let {data, error} = await supabase
            .from("workout_entries")
            .select()
            .eq("type", i.name)
            .order("date", {ascending: false})
            .limit(1);
        
        if(error != null) {
            console.log(`Failed to get last workout of ${i.name}`);
            console.error(error);
        } else {
            let child = document.createElement("label");
            if(data.length == 0) {
                child.innerHTML = `Musclegroup <strong>${i.name}</strong> has not been trained yet`;
            } else {

                const last_workout_date = new Date(data[0].date)
                let today = new Date();
                today.setHours(0, 0, 0, 0);

                const difference_milliseconds = today - last_workout_date;
                const difference_days = Math.floor(difference_milliseconds / (1000 * 60 * 60 * 24));

                console.log(today, data[0].date, difference_milliseconds, difference_days);

                if(difference_days == 1) child.innerHTML = `Musclegroup <strong>${i.name}</strong> last trained 1 day ago`;
                else child.innerHTML = `Musclegroup ${i.name} last trained <strong>${difference_days}</strong> days ago`;
                
            }

            last_workouts_div.appendChild(child);
            last_workouts_div.appendChild(document.createElement("br"));
        }
    }
}

window.submit_workout = submit_workout;
window.enter_new_musclegroup = enter_new_musclegroup;

export { init_main_section };