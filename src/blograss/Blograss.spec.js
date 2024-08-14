Date.prototype.getMonthWeek = function () {
    // 해당 월의 첫 날을 구합니다.
    const firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1);
    // 해당 날짜가 속한 주의 첫 날이 주의 첫 번째 날로 계산되도록 합니다.
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // 현재 날짜가 몇 번째 주에 속하는지 계산
    const dayOfMonth = this.getDate();
    const weekNumber = Math.ceil((dayOfMonth + firstDayOfWeek) / 7);

    // 월과 주차를 객체로 반환합니다.
    return {month:this.getMonth() + 1, week:weekNumber}
};

describe("getMonthWeek", () => {
    it("2024년 1월 1일 입력시, 1월 1주차를 반환해야 합니다.", () => {
        // given
        const targetDate = new Date(2024, 0, 1);
        // when
        const result = targetDate.getMonthWeek();

        // then
        expect(result).toEqual({month:1, week:1})
    });

    it("2024년 5월 30일 입력시, 5월 5주차를 반환해야 합니다.", () => {
        // given
        const targetDate = new Date(2024, 4, 30);

        //when
        const result = targetDate.getMonthWeek();

        // then
        expect(result).toEqual({month:5, week:5})
    })

    it("2024년 8월 15일 입력시, 8월 3주차를 반환해야 합니다.", () => {
        // given
        const targetDate = new Date(2024, 7, 15);

        // when
        const result = targetDate.getMonthWeek();

        // then
        expect(result).toEqual({month:8, week:3}) 
    })

    it("2024년 2월 3일 입력시, 2월 1주차를 반환해야 합니다.", () => {
        // given
        const targetDate = new Date(2024, 1, 3);

        // when
        const result = targetDate.getMonthWeek();

        // then
        expect(result).toEqual({month:2, week:1})
    })
})

function getWeeksInMonth(year, month) {
    const monthFormatted = month - 1;
    // month는 0부터 시작하므로, 1월을 원한다면 month = 0으로 전달해야 함
    const firstDayOfMonth = new Date(year, monthFormatted, 1);
    const lastDayOfMonth = new Date(year, monthFormatted + 1, 0);

    // 첫 번째 날의 요일 (0 = 일요일, 1 = 월요일, ..., 6 = 토요일)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // 마지막 날의 날짜
    const lastDate = lastDayOfMonth.getDate();

    // 해당 달의 주 수 계산
    const daysInMonth = lastDate + firstDayOfWeek;
    const weeksInMonth = Math.ceil(daysInMonth / 7);

    return weeksInMonth;
}

describe("getWeeksInMonth", () => {
    it("2024년 3월은 6개의 주가 있으므로, 6을 반환해야 합니다.", () => {
        // given
        const targetYear = 2024;
        const targetMonth = 3;

        // when
        const result = getWeeksInMonth(targetYear, targetMonth);
        // then 
        expect(result).toBe(6);
    })

    it("2024년 6월은 6개의 주가 있으므로, 6을 반환해야 합니다.", () => {
        // given
        const targetYear = 2024;
        const targetMonth = 6;

        // when
        const result = getWeeksInMonth(targetYear, targetMonth);

        // then
        expect(result).toBe(6)
    })

    it("2024년 8월은 5개의 주가 있으므로, 5를 반환해야 합니다.", () => {
        // given
        const targetYear = 2024;
        const targetMonth = 8;

        // when
        const result = getWeeksInMonth(targetYear, targetMonth);

        // then
        expect(result).toBe(5);
    })
})