import { view_section, login_section } from "./view.js";
import { init_main_section } from "./main_section.js";

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const credentials = ["email", "password", "url", "public_anon_token"];

let supabase = null;

function init_login_section() {
    view_section(login_section);
}

function reset_credentials() {
    for(let i of credentials) {
        localStorage.removeItem(i);
    }
}

async function get_credentials() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let url = document.getElementById("url").value;
    let public_anon_token = document.getElementById("public_anon_token").value;

    if(email == '') {
        alert("The email field should be filled in!");
        return;
    }

    if(password == '') {
        alert("The password field should be filled in!");
        return;
    }

    if(url == '') {
        alert("The url field should be filled in!");
        return;
    }

    if(public_anon_token == '') {
        alert("The public_anon_token field should be filled in!");
        return;
    }

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("url", url);
    localStorage.setItem("public_anon_token", public_anon_token);

    login();
}

async function login() {
    supabase = createClient(localStorage.getItem("url"), localStorage.getItem("public_anon_token"));

    const { data, error } = await supabase.auth.signInWithPassword({
        email: localStorage.getItem("email"),
        password: localStorage.getItem("password"),
    })

    if(error != null) {
        console.error(error);
        failed_to_login();
    }

    console.log("Logged in!");

    sessionStorage.setItem("supabase", JSON.stringify(supabase));

    await init_main_section();
}

function failed_to_login() {
    for(let i of credentials) {
        localStorage.removeItem(i);
    }

    alert("Failed to login!");

    window.location.reload();
}

function get_supabase_client() {
    if(supabase == null) throw Error("Client is not initialised yet");

    return supabase;
}

async function logout() {
    await supabase.auth.signOut();
    reset_credentials();
    init_login_section();
}

window.get_credentials = get_credentials;
window.login = login;
window.logout = logout;

export { login, init_login_section, credentials, get_supabase_client };