const sections = ["login_section", "main_section"];
const login_section = sections[0];
const main_section = sections[1];

function view_section(section) {
    if(!sections.includes(section)) {
        throw Error(`Section ${section} does not exist`);
    }

    for(let i of sections) {
        if(i == section) document.getElementById(i).style.display = 'block';
        else document.getElementById(i).style.display = 'none';
    }
}

export { view_section, login_section, main_section };