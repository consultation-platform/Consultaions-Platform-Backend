exports.getSemesterNumber = (birthDateInput) => {
  const birthDate = new Date(birthDateInput);

  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();

  let semester;

  if (
    (birthMonth === 12 && birthDay >= 23) ||
    (birthMonth >= 1 && birthMonth <= 3) ||
    (birthMonth === 3 && birthDay <= 22)
  ) {
    semester = "الشتاء";
  } else if (
    (birthMonth === 3 && birthDay >= 23) ||
    (birthMonth >= 4 && birthMonth <= 6) ||
    (birthMonth === 6 && birthDay <= 22)
  ) {
    semester = "الربيع";
  } else if (
    (birthMonth === 6 && birthDay >= 23) ||
    (birthMonth >= 7 && birthMonth <= 9) ||
    (birthMonth === 9 && birthDay <= 22)
  ) {
    semester = "الصيف";
  } else if (
    (birthMonth === 9 && birthDay >= 23) ||
    (birthMonth >= 10 && birthMonth <= 11) ||
    (birthMonth === 12 && birthDay <= 22)
  ) {
    semester = "الخريف";
  }

  return semester;
};

exports.getWeekNumber = (birthDateInput) => {
  const birthDate = new Date(birthDateInput);

  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const TotalDays = birthMonth * 30 + birthDay;
  const WeekNumber = Math.ceil(TotalDays / 7);
  return WeekNumber;
};

exports.getDayNumber = (birthDateInput) => {
  const birthDate = new Date(birthDateInput);
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const TotalDays = birthMonth * 30 + birthDay;
  return TotalDays;
};
