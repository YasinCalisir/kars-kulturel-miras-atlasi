
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


// GEZİ TAMAMLAMA SİSTEMİ

const karsTourSections = {
    "tarihi-mimari": 5,
    "ani": 2,
    "cildir": 2,
    "sarikamis": 2,
    "kuyucuk": 3,
    "peynir-muzesi": 5,
    "milli-degerlerimiz": 5
};


// Öğrenciyi diğer öğrencilerden ayıran kimlik
function getKarsStudentKey() {

    let student = JSON.parse(
        localStorage.getItem("karsStudent") || "null"
    );

    if (!student) return null;

    return JSON.stringify([
        student.name,
        student.school,
        student.studentClass
    ]);
}


// Öğrencinin cevapladığı soruyu kaydet
function markKarsQuestionAnswered(sectionId, questionId) {

    let studentKey = getKarsStudentKey();

    if (!studentKey) return false;

    let progress = JSON.parse(
        localStorage.getItem("karsQuizProgress") || "{}"
    );

    if (!progress[studentKey]) {
        progress[studentKey] = {};
    }

    if (!progress[studentKey][sectionId]) {
        progress[studentKey][sectionId] = {};
    }

    progress[studentKey][sectionId][questionId] = true;

    localStorage.setItem(
        "karsQuizProgress",
        JSON.stringify(progress)
    );

    return true;
}


// Sorunun daha önce cevaplanıp cevaplanmadığını kontrol et
function isKarsQuestionAnswered(sectionId, questionId) {

    let studentKey = getKarsStudentKey();

    if (!studentKey) return false;

    let progress = JSON.parse(
        localStorage.getItem("karsQuizProgress") || "{}"
    );

    return !!(
        progress[studentKey] &&
        progress[studentKey][sectionId] &&
        progress[studentKey][sectionId][questionId]
    );
}


// Sayfadaki cevaplanmış soruları getir
function getKarsAnsweredQuestions(sectionId, totalQuestions) {

    let answered = {};

    for (let i = 1; i <= totalQuestions; i++) {
        answered[i] = isKarsQuestionAnswered(sectionId, i);
    }

    return answered;
}


// Bir gezi bölümünün tamamlanıp tamamlanmadığını kontrol et
function isKarsSectionComplete(sectionId) {

    let total = karsTourSections[sectionId];

    if (!total) return false;

    for (let i = 1; i <= total; i++) {
        if (!isKarsQuestionAnswered(sectionId, i)) {
            return false;
        }
    }

    return true;
}


// Bütün gezi bölümlerinin tamamlanıp tamamlanmadığını kontrol et
function isKarsTourComplete() {

    for (let sectionId in karsTourSections) {
        if (!isKarsSectionComplete(sectionId)) {
            return false;
        }
    }

    return true;
}


// Gezi ilerleme durumunu getir
function getKarsTourProgress() {

    let completed = 0;
    let total = 0;

    for (let sectionId in karsTourSections) {

        let questionCount = karsTourSections[sectionId];
        total += questionCount;

        for (let i = 1; i <= questionCount; i++) {
            if (isKarsQuestionAnswered(sectionId, i)) {
                completed++;
            }
        }
    }

    return {
        completed: completed,
        total: total,
        percentage: Math.round((completed / total) * 100),
        complete: completed === total
    };
}
