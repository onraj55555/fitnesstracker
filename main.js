const muscleGroupKey = "musclegroups"

function getAllMuscleGroups() {
    let muscleGroups = localStorage.getItem(muscleGroupKey);

    if(muscleGroups == null) return null;
    return JSON.parse(muscleGroups);
}

function storeAllMuscleGroups(muscleGroups) {
    localStorage.setItem(muscleGroupKey, JSON.stringify(muscleGroups))
}

function addNewMuscleGroup() {
    console.log("Adding new muscle group");

    let text = document.getElementById("newMuscleGroup").value;

    let allMuscleGroups = getAllMuscleGroups();

    if(allMuscleGroups == null) {
        // Make new list
        allMuscleGroups = [];
    }

    if(allMuscleGroups.includes(text)) {
        console.log("Muscle group already exists");
    } else {
        allMuscleGroups.push(text);

        storeAllMuscleGroups(allMuscleGroups);
    }

    window.location.reload();
}

function printAllLastWorkouts() {
    let muscleGroups = getAllMuscleGroups();

    let lastWorkoutsDiv = document.getElementById("lastWorkouts");

    if(muscleGroups == null) {
        // No muscle groups, print correct error message

        // TODO
        let error = document.createElement("label");
        error.innerHTML = "No musclegroups got trained yet!"

        lastWorkoutsDiv.appendChild(error);

        return;
    }

    let workoutList = document.createElement("ul");

    for(i of muscleGroups) {
        let muscleGroupWorkouts = JSON.parse(localStorage.getItem(i));

        let workout = document.createElement("li");

        if(muscleGroupWorkouts == null) {
            workout.innerHTML = `Musclegroup ${i} has not been trained yet!`;
        } else {
            let lastWorkout = muscleGroupWorkouts[muscleGroupWorkouts.length - 1];
            let workoutDate = new Date(lastWorkout.date);
            let today = new Date();
            today.setHours(0, 0, 0, 0);

            console.log(today);
            console.log(workoutDate);
            let delta = Math.round((today - workoutDate) / (1000 * 60 * 60 * 24));
            workout.innerHTML = `Musclegroup ${i} last trained ${delta} day(s) ago`;
        }

        workoutList.appendChild(workout);
    }

    lastWorkoutsDiv.appendChild(workoutList);
}

function saveWorkout() {
    let allMuscleGroups = getAllMuscleGroups();

    if(allMuscleGroups == null) {
        console.log("No musclegroups found, perhaps add some!");
        return;
    }

    let musclegroup = document.getElementById("selectedMuscleGroup").value;

    if(!allMuscleGroups.includes(musclegroup)) {
        console.log(`Musclegroup ${musclegroup} not found!`);
        return;
    }

    let workouts = JSON.parse(localStorage.getItem(musclegroup));

    if(workouts == null) workouts = [];

    let workoutProgress = document.getElementById("workoutState").value;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let workout = {
        "date": today,
        "progress": workoutProgress
    };

    workouts.push(workout);

    localStorage.setItem(musclegroup, JSON.stringify(workouts));
}

printAllLastWorkouts();