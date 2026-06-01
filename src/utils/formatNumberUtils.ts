export const formatNumber = (num: number | string, compact: boolean = false): string => {
    if (num === null || num === undefined) return "0";

    const number = typeof num === "string" ? parseFloat(num) : num;

    if (isNaN(number)) return "0";

    if (compact) {
        if (number >= 1_000_000) {
            return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (number >= 10_000) {
            return (number / 1_000).toFixed(0) + "k";
        }
        if (number >= 1_000) {
            return (number / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        }
        return number.toString();
    }

    return number.toLocaleString("en-US");
};