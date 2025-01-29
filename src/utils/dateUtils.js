export const getNextFridayAt6PM = () => {
  const date = new Date();
  const nextFriday = new Date(
    date.setDate(date.getDate() + ((2 - date.getDay() + 7) % 7 || 7))
  );
  nextFriday.setHours(18, 0, 0, 0); // set for 6pm
  return nextFriday.getTime();
};
