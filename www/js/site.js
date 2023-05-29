function changePage(pg) {
    let class_pg = document.getElementById("main_class")
    //let gpa_pg = document.getElementById("main_gpa")
    let final_pg = document.getElementById("main_final")
    //let help_class_pg = document.getElementById("main_help-class")
    //let help_gpa_pg = document.getElementById("main_help-gpa")
    //let help_final_pg = document.getElementById("main_help-final")

    let class_link = document.getElementById("link_class")
    //let gpa_link = document.getElementById("link_gpa")
    let final_link = document.getElementById("link_final")
    //let help_class_link = document.getElementById("link_help-class")
    //let help_gpa_link = document.getElementById("link_help-gpa")
    //let help_final_link = document.getElementById("link_help-final")

    class_pg.hidden = true
    final_pg.hidden = true

    class_link.classList.remove("active")
    final_link.classList.remove("active")

    if (pg === "class") {
        class_pg.hidden = false
        class_link.classList.add("active")
    } else if (pg === "final") {
        final_pg.hidden = false
        final_link.classList.add("active")
    }
}
$(document).ready(function () {
    changePage("class")
    document.getElementById("loadingSpinner").remove()
})