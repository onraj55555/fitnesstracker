// Code that gets called when everything is loaded in
// What it does
// Attempts to login
// Sets the view to the correct one

import { init_main_section } from "./main_section.js";
import { login, init_login_section, credentials } from "./login_section.js";

async function init() {
    console.log("Init application");
    // Check if localStorage contains credentials

    for(let i of credentials) {
        if(localStorage.getItem(i) == null) {
            console.log("Not all credentials exist, requesting all");
            init_login_section();
            return;
        }
    }

    await login();
}

await init();