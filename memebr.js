function skillsMember() {
    var skills = document.getElementById("skills");
    var skillsMember = document.getElementById("skillsMember");
    if (skillsMember.style.display === "none") {
        skillsMember.style.display = "block";
        skills.innerHTML = "Hide Skills";
    } else {
        skillsMember.style.display = "none";
        skills.innerHTML = "Show Skills";
    }
}