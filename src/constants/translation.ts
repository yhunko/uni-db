const ID = "№";

export default {
  route: {
    home: "Главная",
    table: "Таблица",
    settings: "Настройки",
    about: "О приложении",
  },
  table: {
    faculty: {
      faculty: "Факультет",
      id: ID,
      name: "Название факультета",
      deanName: "Декан",
      roomPhone: "Телефон",
    },
    teacher: {
      teacher: "Преподаватель",
      id: ID,
      name: "Имя",
      surname: "Фамилия",
      patronymic: "Отчество",
      category: "Категория",
      facultyId: "Факультет",
    },
    group: {
      group: "Группа",
      id: ID,
      name: "Название",
      number: "Номер",
      year: "Год",
      course: "Курс",
      branch: "Отделение",
    },
    subject: {
      subject: "Предмет",
      id: ID,
      code: "Шифр",
      name: "Название",
      hours: "Всего часов",
      offsetType: "Вид зачёта",
    },
    student: {
      student: "Студент",
      id: ID,
      name: "Имя",
      surname: "Фамилия",
      birthYear: "Год рождения",
      groupId: "Группа",
    },
    load: {
      load: "Нагрузка",
      id: ID,
      year: "Год",
      groupId: "Группа",
      subjectId: "Предмет",
      teacherId: "Преподаватель",
    },
    certification: {
      certification: "Аттестация",
      id: ID,
      date: "Дата",
      type: "Вид",
      loadId: "Нагрузка",
    },
    mark: {
      mark: "Оценка",
      id: ID,
      studentId: "Студент",
      certificationId: "Аттестация",
    },
  },
};
