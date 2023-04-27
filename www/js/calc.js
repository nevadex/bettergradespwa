$(document).ready(function () {
    document.getElementById("priWeightRange").addEventListener("input", (ev) => {
        document.getElementById("priWeightLabel").innerText = "Primary Weight: " + (getPriWeight() * 100).toFixed(0) + "%"
        validateWeights()
    })
    document.getElementById("secWeightRange").addEventListener("input", (ev) => {
        document.getElementById("secWeightLabel").innerText = "Secondary Weight: " + (getSecWeight() * 100).toFixed(0) + "%"
        validateWeights()
    })
    document.getElementById("supWeightRange").addEventListener("input", (ev) => {
        document.getElementById("supWeightLabel").innerText = "Supportive Weight: " + (getSupWeight() * 100).toFixed(0) + "%"
        validateWeights()
    })
    document.getElementById("estTarget").addEventListener("input", (ev) => {
        document.getElementById("estTargetLabel").innerText = "Target Grade: " + (getTargetGrade()).toFixed(0) + "%"
        validateWeights()
    })

    document.getElementById("gradeInput").onpaste = e => e.preventDefault() // TODO: work with decimals
    document.getElementById("gradeInput").addEventListener("keypress", (ev) => {
        if (ev.code === "Enter") {
            ev.preventDefault()
            let r = new RegExp("\\d+\\/\\d+", "gm")
            let t = ev.currentTarget.value
            if (r.test(t)) {
                let cgs = [...t.matchAll(new RegExp("(\\d+)\\/(\\d+)", 'gm'))][0]
                let a = document.createElement("a")
                a.classList.add("list-group-item", "list-group-item-action")
                if (document.getElementById("priGradeTypeSel").checked === true) {
                    a.classList.add("list-group-item-info")
                    a.dataset["gt"] = "p"
                    a.appendChild(gradeListP4("Primary"))
                } else if (document.getElementById("secGradeTypeSec").checked === true) {
                    a.classList.add("list-group-item-primary")
                    a.dataset["gt"] = "s"
                    a.appendChild(gradeListP4("Secondary"))
                } else {
                    a.classList.add("list-group-item-secondary")
                    a.dataset["gt"] = "u"
                    a.appendChild(gradeListP4("Supportive"))
                }
                a.dataset["pe"] = cgs[1]
                a.dataset["pp"] = cgs[2]
                a.appendChild(gradeListP4(cgs[0]))
                a.appendChild(gradeListP4((cgs[1]/cgs[2]*100).toFixed(0)+"%"))
                a.appendChild(gradeListP4(calcLetterGrade(cgs[1], cgs[2])))
                a.onclick = (ev) => {ev.currentTarget.remove(); refreshCalculations(); refreshEstimate();}
                document.getElementById("gradeList").appendChild(a)
                ev.currentTarget.value = ""
                refreshCalculations()
                refreshEstimate()
            } else {
                alert("stop using inspect element")
            }
            return
        }

        let r = new RegExp("[\\d|\\/]")
        let k = ev.key.toLowerCase()
        if (!r.test(k)) {
            ev.preventDefault()
            if (k === 'p') {
                document.getElementById("priGradeTypeSel").click()
            } else if (k === 's') {
                document.getElementById("secGradeTypeSec").click()
            } else if (k === 'u') {
                document.getElementById("supGradeTypeSel").click()
            }
        }
        return
    })

    {
        let calcRefresh = document.getElementsByClassName("_js-inputCalcRefresh")
        for (let i = 0; i < calcRefresh.length; i++) {
            calcRefresh[i].addEventListener("input", (ev) => {
                refreshCalculations()
            })
        }
    }

    {
        let estRefresh = document.getElementsByClassName("_js-estRefresh")
        for (let i = 0; i < estRefresh.length; i++) {
            estRefresh[i].addEventListener("input", (ev) => {
                refreshEstimate()
            })
        }
    }

    document.getElementById("gradeList").style.height = document.getElementById("entryDiv").offsetHeight - document.getElementById("gradesDivHeader").offsetHeight - document.getElementById("gradeList").offsetHeight + "px"

    refreshCalculations()
})

function getPriWeight() {
    return parseFloat(document.getElementById("priWeightRange").value)
}
function getSecWeight() {
    return parseFloat(document.getElementById("secWeightRange").value)
}
function getSupWeight() {
    return parseFloat(document.getElementById("supWeightRange").value)
}
function validateWeights() {
    let total = getPriWeight() + getSecWeight() + getSupWeight()
    let e = document.getElementById("invalidWeightsWarning")
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
function getTargetGrade() {
    return parseFloat(document.getElementById("estTarget").value)*100
}

function calcLetterGrade(pe, pp) {
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

function gradeListP4(t) {
    p = document.createElement("p")
    p.classList.add("stacked-text", "w-25")
    p.innerHTML = t
    return p
}

function refreshCalculations() {
    let gl = document.getElementById("gradeList").children
    pP=0, pE=0, sP=0, sE=0, uP=0, uE=0
    for (let x of gl) {
        //let x = gl[i]
        if (x.dataset["gt"] === "p") {
            pE += parseInt(x.dataset["pe"])
            pP += parseInt(x.dataset['pp'])
        } else if (x.dataset["gt"] === "s") {
            sE += parseInt(x.dataset["pe"])
            sP += parseInt(x.dataset["pp"])
        } else if (x.dataset["gt"] === "u") {
            uE += parseInt(x.dataset["pe"])
            uP += parseInt(x.dataset["pp"])
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
    pc = pa*getPriWeight()
    sc = sa*getSecWeight()
    uc = ua*getSupWeight()
    //if (uc === 0) {uc = getSupWeight()/100}
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

    document.getElementById("gr-pa").innerHTML = (pa.toFixed(dr))+"%"
    document.getElementById("gr-pa").dataset["real"] = pa
    document.getElementById("gr-sa").innerHTML = (sa.toFixed(dr))+"%"
    document.getElementById("gr-sa").dataset["real"] = sa
    document.getElementById("gr-ua").innerHTML = (ua.toFixed(dr))+"%"
    document.getElementById("gr-ua").dataset["real"] = ua
    document.getElementById("gr-pc").innerHTML = (pc.toFixed(dr))+"%"
    document.getElementById("gr-pc").dataset["real"] = pc
    document.getElementById("gr-sc").innerHTML = (sc.toFixed(dr))+"%"
    document.getElementById("gr-sc").dataset["real"] = sc
    document.getElementById("gr-uc").innerHTML = (uc.toFixed(dr))+"%"
    document.getElementById("gr-uc").dataset["real"] = uc
    document.getElementById("gr-f").innerHTML = (f.toFixed(dr))+"%"
    document.getElementById("gr-f").dataset["real"] = f
}

function refreshEstimate() {
    let tg = getTargetGrade()
    let ediv = document.getElementById("estDiv")

    if (Math.round(f) < tg) {
        document.getElementById("estGradeReached").hidden = true
        ediv.hidden = false
        let ptg, stg, utg, rd=0

        ptg = (tg * getPriWeight() / 100)
        //if (!document.getElementById("priEstGradeSel").checked) {ptg=-1}
        stg = (tg * getSecWeight() / 100)
        //if (!document.getElementById("secEstGradeSel").checked) {stg=-1}
        utg = (tg * getSupWeight() / 100)
        //if (!document.getElementById("supEstGradeSel").checked) {utg=-1}

        if (pc/100 > ptg && ptg!==-1) { rd+=(pc/100)-ptg }
        if (sc/100 > stg && stg!==-1) { rd+=(sc/100)-stg }
        if (uc/100 > utg && utg!==-1) { rd+=(uc/100)-utg }// TODO: the reduction is fixing the util of the disabled cats, but it does not move the cats to the enable cats | might not do bc its impossible to get 100%, let alone >100%

        ptg-=rd, stg-=rd, utg-=rd

        let ppn = PtsNeeded(pP, pE, ptg, getPriWeight())
        let spn = PtsNeeded(sP, sE, stg, getSecWeight())
        let upn = PtsNeeded(uP, uE, utg, getSupWeight())

        ppn = ppn >= 10001 ? "&infin;" : ppn
        spn = spn >= 10001 ? "&infin;" : spn
        upn = upn >= 10001 ? "&infin;" : upn

        document.getElementById("es-p-pn").innerHTML = ppn
        document.getElementById("es-s-pn").innerHTML = spn
        document.getElementById("es-u-pn").innerHTML = upn


    } else {
        ediv.hidden = true
        document.getElementById("estGradeReached").hidden = false
    }
}

function PtsNeeded(p, e, tg, w) {
    let ad = 0;
    let g = e/p;
    while (g*w < tg) {
        ad++
        g = (e+ad)/(p+ad)
        if (ad > 10000) break
    }
    return ad;
}