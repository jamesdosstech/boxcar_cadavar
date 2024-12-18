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
