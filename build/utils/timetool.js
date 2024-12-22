/**
 * 判断当前时间是否在上午9点25分到11点半之间，或者在下午1点到3点之间
 * @returns {boolean} 如果当前时间在任意一个指定时间范围内，则返回true；否则返回false
 */
export function isCurrentTimeInRange() {
    // 获取当前时间
    const now = new Date();
    // 获取当前时间的小时和分钟
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    // 获取当前时间的星期几（0表示星期天，1表示星期一，以此类推）
    const currentDay = now.getDay();
    // 定义上午9点25分和11点半的小时和分钟
    const morningStartHour = 9;
    const morningStartMinute = 25;
    const morningEndHour = 11;
    const morningEndMinute = 30;
    // 定义下午1点和3点的小时
    const afternoonStartHour = 13;
    const afternoonEndHour = 15;
    // 判断当前时间是否在上午9点25分到11点半之间
    const isInMorningRange = (currentHour > morningStartHour && currentHour < morningEndHour) ||
        (currentHour === morningStartHour && currentMinute >= morningStartMinute) ||
        (currentHour === morningEndHour && currentMinute <= morningEndMinute);
    // 判断当前时间是否在下午1点到3点之间
    const isInAfternoonRange = currentHour >= afternoonStartHour && currentHour < afternoonEndHour;
    // 判断当前时间是否在周一到周五
    const isWeekday = currentDay >= 1 && currentDay <= 5;
    // 如果当前时间在任意一个范围内且在周一到周五，返回true；否则返回false
    return (isInMorningRange || isInAfternoonRange) && isWeekday;
}
//# sourceMappingURL=timetool.js.map