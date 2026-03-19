export const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const getLocalDayName = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    return localDate.getDay();
};

export const combineDateAndTime = (date: string, time: Date) => {
    const [year, month, day] = date.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day,
        time.getHours(),
        time.getMinutes(),
        0,
        0
    ).toISOString();
};