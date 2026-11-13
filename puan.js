
function awardKarsPoint(pageId, questionId) {
    let student = JSON.parse(
        localStorage.getItem("karsStudent") || "null"
    );

    if (!student) {
        alert("Önce Öğrenci Girişi yapmalısın!");
        return false;
    }

    let answers = JSON.parse(
        localStorage.getItem("karsAnswers") || "{}"
    );

    let key = pageId + "_" + questionId;

    if (answers[key]) {
        return false;
    }

    answers[key] = true;

    student.score = (Number(student.score) || 0) + 10;

    localStorage.setItem("karsAnswers", JSON.stringify(answers));
    localStorage.setItem("karsStudent", JSON.stringify(student));

    return true;
}

function getKarsScore() {
    let student = JSON.parse(
        localStorage.getItem("karsStudent") || "null"
    );

    return student ? Number(student.score) || 0 : 0;
}
