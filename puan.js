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

    let key = student.name + "_" + pageId + "_" + questionId;

    if (answers[key]) {
        return false;
    }

    answers[key] = true;

    student.score = (Number(student.score) || 0) + 10;

    localStorage.setItem("karsAnswers", JSON.stringify(answers));
    localStorage.setItem("karsStudent", JSON.stringify(student));

    let students = JSON.parse(
        localStorage.getItem("karsStudents") || "[]"
    );

    let index = students.findIndex(s =>
        s.name === student.name &&
        s.school === student.school &&
        s.studentClass === student.studentClass
    );

    if (index >= 0) {
        students[index].score = student.score;
    } else {
        students.push(student);
    }

    localStorage.setItem("karsStudents", JSON.stringify(students));

    return true;
}

function getKarsScore() {

    let student = JSON.parse(
        localStorage.getItem("karsStudent") || "null"
    );

    return student ? Number(student.score) || 0 : 0;
}
