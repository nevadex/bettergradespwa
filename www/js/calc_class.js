$(document).ready(function () {
    document.getElementById("class_priWeightRange").addEventListener("input", (ev) => {
        document.getElementById("class_priWeightLabel").innerText = "Primary Weight: " + (class_getPriWeight() * 100).toFixed(0) + "%"
        class_validateWeights()
    })
    document.getElementById("class_secWeightRange").addEventListener("input", (ev) => {
        document.getElementById("class_secWeightLabel").innerText = "Secondary Weight: " + (class_getSecWeight() * 100).toFixed(0) + "%"
        class_validateWeights()
    })
    document.getElementById("class_supWeightRange").addEventListener("input", (ev) => {
        document.getElementById("class_supWeightLabel").innerText = "Supportive Weight: " + (class_getSupWeight() * 100).toFixed(0) + "%"
        class_validateWeights()
    })
    document.getElementById("class_estTarget").addEventListener("input", (ev) => {
        document.getElementById("class_estTargetLabel").innerText = "Target Grade: " + (class_getTargetGrade()).toFixed(0) + "%"
        class_validateWeights()
    })

    document.getElementById("class_gradeInput").onpaste = e => e.preventDefault()
    document.getElementById("class_gradeInput").addEventListener("keypress", (ev) => {
        ev.currentTarget.classList.remove("is-invalid")
        if (ev.code === "Enter" || ev.code === "NumpadEnter") {
            ev.preventDefault()
            //let r = new RegExp("\\d+\\/\\d+", "gm")
            let r = new RegExp("(?:(?:\\d+|(?:\\d+\\.*\\d+))\\/(?:\\d+|(?:\\d+\\.*\\d+)))$", "gm") // support for decimals
            let t = ev.currentTarget.value
            if (r.test(t)) {
                //let cgs = [...t.matchAll(new RegExp("(\\d+)\\/(\\d+)", 'gm'))][0]
                let cgs = [...t.matchAll(new RegExp("([\\d.]+)\\/([\\d.]+)", "gm"))][0] // support for decimals
                let a = document.createElement("a")
                a.classList.add("list-group-item", "list-group-item-action")
                if (document.getElementById("class_priGradeTypeSel").checked === true) {
                    a.classList.add("list-group-item-info")
                    a.dataset["gt"] = "p"
                    a.appendChild(class_gradeListP4("Primary"))
                } else if (document.getElementById("class_secGradeTypeSec").checked === true) {
                    a.classList.add("list-group-item-primary")
                    a.dataset["gt"] = "s"
                    a.appendChild(class_gradeListP4("Secondary"))
                } else {
                    a.classList.add("list-group-item-secondary")
                    a.dataset["gt"] = "u"
                    a.appendChild(class_gradeListP4("Supportive"))
                }
                if (parseFloat(cgs[2]) === 0.0) {
                    ev.currentTarget.classList.add("is-invalid")
                    return;
                }
                a.dataset["pe"] = cgs[1]
                a.dataset["pp"] = cgs[2]
                a.appendChild(class_gradeListP4(cgs[0]))
                a.appendChild(class_gradeListP4((cgs[1]/cgs[2]*100).toFixed(0)+"%"))
                a.appendChild(class_gradeListP4(class_calcLetterGrade(cgs[1], cgs[2])))
                a.onclick = (ev) => {ev.currentTarget.remove(); class_refreshCalculations(); class_refreshEstimate();}
                document.getElementById("class_gradeList").appendChild(a)
                ev.currentTarget.value = ""
                class_refreshCalculations()
                class_refreshEstimate()
            } else {
                //alert("stop using inspect element")
                ev.currentTarget.classList.add("is-invalid")
            }
            return
        }

        //let r = new RegExp("[\\d|\\/]")
        let r = new RegExp("[\\d\\/.]") // support for decimals
        let k = ev.key.toLowerCase()
        if (!r.test(k)) {
            ev.preventDefault()
            if (k === 'p') {
                document.getElementById("class_priGradeTypeSel").click()
            } else if (k === 's') {
                document.getElementById("class_secGradeTypeSec").click()
            } else if (k === 'u') {
                document.getElementById("class_supGradeTypeSel").click()
            }
        }
        return
    })

    {
        let calcRefresh = document.getElementsByClassName("_js_class-inputCalcRefresh")
        for (let i = 0; i < calcRefresh.length; i++) {
            calcRefresh[i].addEventListener("input", (ev) => {
                class_refreshCalculations()
            })
        }
    }

    {
        let estRefresh = document.getElementsByClassName("_js_class-estRefresh")
        for (let i = 0; i < estRefresh.length; i++) {
            estRefresh[i].addEventListener("input", (ev) => {
                class_refreshEstimate()
            })
        }
    }

    document.getElementById("class_gradeList").style.height = document.getElementById("class_entryDiv").offsetHeight - document.getElementById("class_gradesDivHeader").offsetHeight - document.getElementById("class_gradeList").offsetHeight + "px"

    class_refreshCalculations()
})

function class_getPriWeight() {
    return parseFloat(document.getElementById("class_priWeightRange").value)
}
function class_getSecWeight() {
    return parseFloat(document.getElementById("class_secWeightRange").value)
}
function class_getSupWeight() {
    return parseFloat(document.getElementById("class_supWeightRange").value)
}
function class_validateWeights() {
    let total = class_getPriWeight() + class_getSecWeight() + class_getSupWeight()
    let e = document.getElementById("class_invalidWeightsWarning")
    if (total > 1.0) {
        e.innerHTML = "Invalid Weights - Weight combination is too high, lower one or more grade weights to continue"
        e.hidden = false
    } else if (total < 1.0) {
        e.innerHTML = "Invalid Weights - Weight combination is too low, raise one or more grade weights to continue"
        e.hidden = false
    } else {
        e.hidden = true
    }
}
function class_getTargetGrade() {
    return parseFloat(document.getElementById("class_estTarget").value)*100
}

function class_calcLetterGrade(pe, pp) {
    let p = pe/pp
    if (p >= 0.92) {
        return "A"
    } else if (p >= 0.83) {
        return "B"
    } else if (p >= 0.74) {
        return "C"
    } else if (p >= 0.65) {
        return "D"
    } else {
        return "F"
    }
}

let pa, sa, ua, pc, sc, uc, f
let pP=0, pE=0, sP=0, sE=0, uP=0, uE=0
let pn=0, sn=0, un=0

function class_gradeListP4(t) {
    p = document.createElement("p")
    p.classList.add("stacked-text", "w-25")
    p.innerHTML = t
    return p
}

function class_refreshCalculations() {
    let gl = document.getElementById("class_gradeList").children
    pP=0, pE=0, sP=0, sE=0, uP=0, uE=0
    pn=0, sn=0, un=0
    for (let x of gl) {
        //let x = gl[i]
        if (x.dataset["gt"] === "p") {
            pn++
            pE += parseFloat(x.dataset["pe"])
            pP += parseFloat(x.dataset['pp'])
        } else if (x.dataset["gt"] === "s") {
            sn++
            sE += parseFloat(x.dataset["pe"])
            sP += parseFloat(x.dataset["pp"])
        } else if (x.dataset["gt"] === "u") {
            un++
            uE += parseFloat(x.dataset["pe"])
            uP += parseFloat(x.dataset["pp"])
        }
    }
    if (pE === 0 && pP === 0) { pE=1; pP=1; }
    if (sE === 0 && sP === 0) { sE=1; sP=1; }
    if (uE === 0 && uP === 0) { uE=1; uP=1; }// else if (uE === 0 && uP !== 0) { uE=1; }
    /*if (pE === 0 && pP === 0) { pE=1 }
    if (sE === 0 && sP === 0) { sE=1 }*/
    //if (uE === 0 && uP !== 0) { uE=1; }
    pa = pE/pP*100
    sa = sE/sP*100
    ua = uE/uP*100
    pc = pa*class_getPriWeight()
    sc = sa*class_getSecWeight()
    uc = ua*class_getSupWeight()
    //if (uc === 0) {uc = class_getSupWeight()/100}
    f = pc+sc+uc

    let dr = 0
    /*
    pa = pa%1!==0 ? (pa.toFixed(dr)) : pa
    sa = sa%1!==0 ? (sa.toFixed(dr)) : sa
    ua = ua%1!==0 ? (ua.toFixed(dr)) : ua
    pc = pc%1!==0 ? (pc.toFixed(dr)) : pc
    sc = sc%1!==0 ? (sc.toFixed(dr)) : sc
    uc = uc%1!==0 ? (uc.toFixed(dr)) : uc
    */

    document.getElementById("class_gr-pa").innerHTML = (pa.toFixed(dr))+"%"
    document.getElementById("class_gr-pa").dataset["real"] = pa
    document.getElementById("class_gr-sa").innerHTML = (sa.toFixed(dr))+"%"
    document.getElementById("class_gr-sa").dataset["real"] = sa
    document.getElementById("class_gr-ua").innerHTML = (ua.toFixed(dr))+"%"
    document.getElementById("class_gr-ua").dataset["real"] = ua
    document.getElementById("class_gr-pc").innerHTML = (pc.toFixed(dr))+"%"
    document.getElementById("class_gr-pc").dataset["real"] = pc
    document.getElementById("class_gr-sc").innerHTML = (sc.toFixed(dr))+"%"
    document.getElementById("class_gr-sc").dataset["real"] = sc
    document.getElementById("class_gr-uc").innerHTML = (uc.toFixed(dr))+"%"
    document.getElementById("class_gr-uc").dataset["real"] = uc
    document.getElementById("class_gr-f").innerHTML = (f.toFixed(dr))+"%"
    document.getElementById("class_gr-f").dataset["real"] = f

    refreshMaintainEstimate()
}

function class_refreshEstimate() {
    let tg = class_getTargetGrade()
    let ediv = document.getElementById("class_estDiv")

    if (Math.round(f) < tg) {
        document.getElementById("class_estGradeReached").hidden = true
        ediv.hidden = false
        let ptg, stg, utg, rd=0

        ptg = (tg * class_getPriWeight() / 100)
        //if (!document.getElementById("class_priEstGradeSel").checked) {ptg=-1}
        stg = (tg * class_getSecWeight() / 100)
        //if (!document.getElementById("class_secEstGradeSel").checked) {stg=-1}
        utg = (tg * class_getSupWeight() / 100)
        //if (!document.getElementById("class_supEstGradeSel").checked) {utg=-1}

        if (pc/100 > ptg && ptg!==-1) { rd+=(pc/100)-ptg }
        if (sc/100 > stg && stg!==-1) { rd+=(sc/100)-stg }
        if (uc/100 > utg && utg!==-1) { rd+=(uc/100)-utg }// TODO: the reduction is fixing the util of the disabled cats, but it does not move the cats to the enable cats | might not do bc its impossible to get 100%, let alone >100%

        ptg-=rd, stg-=rd, utg-=rd

        let ppn = class_PtsNeeded(pP, pE, ptg, class_getPriWeight())
        let spn = class_PtsNeeded(sP, sE, stg, class_getSecWeight())
        let upn = class_PtsNeeded(uP, uE, utg, class_getSupWeight())

        ppn = ppn >= 10001 ? "&infin;" : ppn
        spn = spn >= 10001 ? "&infin;" : spn
        upn = upn >= 10001 ? "&infin;" : upn

        document.getElementById("class_es-p-pn").innerHTML = ppn
        document.getElementById("class_es-s-pn").innerHTML = spn
        document.getElementById("class_es-u-pn").innerHTML = upn
    } else {
        ediv.hidden = true
        document.getElementById("class_estGradeReached").hidden = false
    }
}

function refreshMaintainEstimate() {
    return // unused
    let meDiv = document.getElementById("class_mEstDiv")

    if (Math.round(f) <= 99.9) {
        meDiv.hidden = false

        /*let pga = (pE / pn) / (pP / pn)
        let sga = (sE / sn) / (sP / sn)
        let uga = (uE / un) / (uP / un)
        console.log(pE / pn, "/", pP / pn)
        console.log(1 / pga)*/


    } else {
        meDiv.hidden = true
    }
}

function class_PtsNeeded(p, e, tg, w) {
    let ad = 0;
    let g = e/p;
    while (g*w < tg) {
        ad++
        g = (e+ad)/(p+ad)
        if (ad > 10000) break
    }
    return ad;
}