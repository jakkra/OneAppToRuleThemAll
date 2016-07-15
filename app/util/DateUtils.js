
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const weekDays = ['Sunday', 'Monday', 'Thuesdag', 'Wednesday', 'Thursday',
'Friday', 'Saturday',
];

export function getMonthName(monthNbr) {
  return monthNames[monthNbr];
}

export function getDayName(dayOfWeek) {
  return weekDays[dayOfWeek];
}

export function toDateMonth(date) {
  return date.getDate() + '/' + date.getMonth();
}

export function toHourMinutes(date) {
  let minute = date.getMinutes();
  let hour = date.getHours();
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  return hour + ':' + minute;
}
