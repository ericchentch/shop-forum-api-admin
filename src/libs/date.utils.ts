/*


  convert date js to dateTime sql
  author: @ericchentch
*/
export const convertToDateTimeSql = (date: Date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

/*


  check date
  author: @ericchentch
*/
export const isValidDate = (date: any) => {
  return date && Object.prototype.toString.call(date) === '[object Date]';
};

export function formatDate(d: Date, separate: string) {
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join(separate);
}
