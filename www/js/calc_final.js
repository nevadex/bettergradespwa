$(document).ready(function () {
    document.getElementById("final_weightRange").addEventListener("input", (ev) => {
        document.getElementById("final_weightLabel").innerText = "Final Weight: " + (final_getWeight() * 100).toFixed(0) + "%"
    })
    document.getElementById("final_f1_range").addEventListener("input", (ev) => {
        document.getElementById("final_f1").value = parseInt(document.getElementById("final_f1_range").value)
    })
    document.getElementById("final_f1").addEventListener("input", (ev) => {
        document.getElementById("final_f1_range").value = parseFloat(document.getElementById("final_f1").value)
    })
    document.getElementById("final_estTarget").addEventListener("input", (ev) => {
        document.getElementById("final_estTargetLabel").innerText = "Target Grade: " + (final_getTargetGrade()).toFixed(0) + "%"
    })

    let numOnly = document.getElementsByClassName("_js_final-numOnly")
    for (let i = 0; i < numOnly.length; i++) {
        numOnly[i].addEventListener("keypress", (ev) => {
            if ((ev.keyCode < 48 || ev.keyCode > 57) && ev.keyCode !== 13) {
                ev.currentTarget.classList.add("is-invalid")
                ev.preventDefault()
            } else {
                ev.currentTarget.classList.remove("is-invalid")
            }
        })
    }

    {
        let calcRefresh = document.getElementsByClassName("_js_final-inputCalcRefresh")
        for (let i = 0; i < calcRefresh.length; i++) {
            calcRefresh[i].addEventListener("input", (ev) => {
                final_refreshCalculations()
            })
        }
    }
    {
        let estRefresh = document.getElementsByClassName("_js_final-estRefresh")
        for (let i = 0; i < estRefresh.length; i++) {
            estRefresh[i].addEventListener("input", (ev) => {
                final_refreshEstimate()
            })
        }
    }
})

function final_getWeight() {
    return parseFloat(document.getElementById("final_weightRange").value)
}

function final_getTargetGrade() {
    return parseFloat(document.getElementById("final_estTarget").value)*100
}

let final_eoy_grade
let s1 = 0.0
let s2 = 0.0
let f1 = 0.0
let s_weight = 0.0
let s1c = 0.0
let s2c = 0.0
let f1c = 0.0

function final_refreshCalculations() {
    s1 = parseFloat(document.getElementById("final_s1").value)
    s2 = parseFloat(document.getElementById("final_s2").value)
    f1 = parseFloat(document.getElementById("final_f1").value)
    s_weight = (1 - final_getWeight()) / 2

    if (!isNaN(s1) && !isNaN(s2) && !isNaN(f1) && !isNaN(s_weight)) {
        s1c = (s1 * s_weight)
        s2c = (s2 * s_weight)
        f1c = (f1 * final_getWeight())
        final_eoy_grade = s1c + s2c + f1c
        document.getElementById("final_gr-eoy").innerHTML = (final_eoy_grade.toFixed(0)) + "%"
        document.getElementById("final_gr-eoy").dataset["real"] = final_eoy_grade
    }
}

function final_refreshEstimate() {
    let tg = final_getTargetGrade()
    let ediv = document.getElementById("final_estDiv")

    if (!isNaN(s1) && !isNaN(s2) && !isNaN(s_weight)) {
        s1c = (s1 * s_weight)
        s2c = (s2 * s_weight)
    }

    if (Math.round(final_eoy_grade) < tg || (!isNaN(s1) && !isNaN(s2))) {
        document.getElementById("final_estGradeReached").hidden = true
        ediv.hidden = false

        let f1n = (tg - s1c - s2c) / final_getWeight()
        f1n = f1n > 100 ? "&infin;" : f1n
        f1n = f1n < 0 ? "-&infin;" : f1n

        if (typeof f1n == "number") f1n = f1n.toFixed(0)

        document.getElementById("final_es-f1").innerHTML = f1n + "%"
    } else {
        ediv.hidden = true
        document.getElementById("final_estGradeReached").hidden = false
    }
}