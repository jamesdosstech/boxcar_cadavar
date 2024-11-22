// const date = new Date();
//   const dateCopy = new Date(date.getTime());
//   const nextFriday = new Date(
//     dateCopy.setDate(
//       dateCopy.getDate() + ((7 - dateCopy.getDay() + 7) % 7 || 7),
//       dateCopy.setHours(18),
//       dateCopy.setMinutes(0),
//       dateCopy.setSeconds(0)
//     )
//   );

//   export const dayAndHourOfShow = nextFriday.getTime();
export const getNextFridayAt6PM = () => {
    const date = new Date();
    const nextFriday = new Date(
        date.setDate(
            date.getDate() + ((7 - date.getDay() + 7) % 7 || 7)
        )
    );
    nextFriday.setHours(18, 0, 0, 0);
    return nextFriday.getTime();
};
