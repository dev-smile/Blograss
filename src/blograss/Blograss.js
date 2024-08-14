// 공백 및 간격을 위한 상수

import { addHours } from "date-fns";

// 공통
const START_X = 25; // 시작 x 좌표
const START_Y = 55; // 시작 y 좌표

const GRASS_VERTICAL_INTERVAL = 15; // 잔디 수직 간격
const GRASS_HORIZONTAL_INTERVAL = 15; // 잔디 수평 간격

const LEFT_LABEL_DEFAULT_VERTICAL_BLANK = 15; // 왼쪽 라벨 기본 수직 공백

// 일 별 잔디
const DAILY_CARD_WIDTH = 900; // 카드 너비
const DAILY_CARD_HEIGHT = 170; // 카드 높이
const GRASS_DAILY_DEFAULT_VERTICAL_BLANK = 5; // 일 별 잔디 기본 수직 공백
const GRASS_DAILY_DEFAULT_HORIZONTAL_BLANK = 5; // 일 별 잔디 기본 수평 공백

const MONTH_LABEL_DEFAULT_HORIZONTAL_BLANK = 30; // 월 라벨 기본 수평 공백
const MONTH_LABEL_HORIZONTAL_INTERVAL = 70; // 월 라벨 간격
const MONTH_LABEL_GAP = 4; // 월 라벨 공백

// 주 별 잔디
const WEEKLY_CARD_WIDTH = 300; // 카드 너비
const WEEKLY_CARD_HEIGHT = 170; // 카드 높이
const WEEK_LABEL_UNDER_10_BLANK = 27; // 주 라벨 10 미만 수평 공백
const WEEK_LABEL_OVER_10_BLANK = 25; // 주 라벨 10 이상 수평 공백 (2자리 숫자로 간격이 달라짐)

const createBlograssCardTitle = (username, type, year, blogType) => {
  let type_text = "";
  if (type === "daily" || !type) {
    type_text = "Daily";
  } else if (type === "weekly") {
    type_text = "Weekly";
  }
  const title_text = `🌱 ${year}년 ${blogType} ${username} ${type_text} Grass`;

  const blogURL = blogType === "naver" ? `https://blog.naver.com/${username}` : `https://velog.io/@${username}/posts`;

  return `
    <g data-testid="card-title" transform="translate(25, 22)">
        <g transform="translate(0, 0)">
            <a href="${blogURL}">
                <text x="0" y="0" class="header" data-testid="header">${title_text}</text>
            </a>
        </g>
    </g>
    `;
};

const createDailyGrass = (total_at, year) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let currentX = START_X;
  let currentY = START_Y;
  let dayCounter = 0;

  let monthLabels = months
    .map(
      (month, index) => `
      <text x="${
        MONTH_LABEL_DEFAULT_HORIZONTAL_BLANK +
        currentX +
        index * MONTH_LABEL_HORIZONTAL_INTERVAL
      }" y="50" class="left-label">${month}</text>
  `
    )
    .join("");

  let dayLabels = daysOfWeek
    .map(
      (day, index) => `
      <text x="0" y="${
        LEFT_LABEL_DEFAULT_VERTICAL_BLANK +
        currentY +
        index * GRASS_VERTICAL_INTERVAL
      }" class="day-label">${day}</text>
  `
    )
    .join("");

  let days = months
    .flatMap((month, monthIndex) => {
      let monthDays = Array.from(
        { length: daysInMonth[monthIndex] },
        (_, i) => {
          let writing = "day";
          const search_month = `${monthIndex + 1}`.padStart(2, "0");
          const search_day = `${i + 1}`.padStart(2, "0");

          if (total_at.includes(`${year}-${search_month}-${search_day}`)) {
            writing = "writing";
          }

          let rect = `
          <rect 
            x="${GRASS_DAILY_DEFAULT_HORIZONTAL_BLANK + currentX}" 
            y="${
              GRASS_DAILY_DEFAULT_VERTICAL_BLANK +
              currentY +
              (dayCounter % 7) * GRASS_VERTICAL_INTERVAL
            }" 
            width="10" height="10" rx="2" class="${writing}"
          />
      `;
          dayCounter++;
          if (dayCounter % 7 === 0) currentX += GRASS_HORIZONTAL_INTERVAL;
          return rect;
        }
      ).join("");

      currentX += MONTH_LABEL_GAP; // Space between months
      return monthDays;
    })
    .join("");

  return `
    <g data-testid="main-card-body" >
        <svg data-testid="contribution-chart" x="15"  >
            <g transform="translate(0, 0)">
                ${monthLabels}
                ${dayLabels}
                ${days}
            </g>
        </svg>
    </g>
  `;
};

/**
 * 
 * @description createBlograssCardBody에서 호출함
 * @param total_at 블로그 작성 날짜 문자열의 배열 
 */
const createWeeklyGrass = (total_at, year) => {
  let currentX = START_X;
  let currentY = START_Y;

  const MONTHS_IN_A_YEAR = 12;

  // 1 ~ 12까지의 가로줄 숫자 텍스트를 그리는 부분
  let weekLabels = Array.from({ length: MONTHS_IN_A_YEAR }, (_, i) => {
    return `
        <text x="${
          i < 9
            ? WEEK_LABEL_UNDER_10_BLANK +
              currentX +
              i * GRASS_HORIZONTAL_INTERVAL
            : WEEK_LABEL_OVER_10_BLANK +
              currentX +
              i * GRASS_HORIZONTAL_INTERVAL
        }" y="50" class="left-label">${i + 1}</text>
    `;
  }).join("");

  const MAX_WEEKS_IN_A_MONTH = 6;

  // 1 ~ 6까지의 세로줄 숫자 텍스트를 그리는 부분
  let dayLabels = Array.from({ length: MAX_WEEKS_IN_A_MONTH }, (_, i) => {
    return `
        <text x="30" y="${
          LEFT_LABEL_DEFAULT_VERTICAL_BLANK +
          currentY +
          i * GRASS_VERTICAL_INTERVAL
        }" class="day-label" text-anchor="middle">${i + 1}</text>
    `;
  }).join("");

  // JS의 Date 객체는 기본적으로 getWeek가 없음. 메서드를 추가해 준다.
  Date.prototype.getWeek = function () {
    // get week number
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = (today - onejan + 86400000) / 86400000;
    return Math.ceil(dayOfYear / 7) - 1;
  };

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



  const initialMap =Array.from({length:12}).fill("_").reduce((accMap, _, idx) => {
    const MONTH = idx + 1;

    // 1 ~ 12를 key로, 1 ~ 6으로 작성일을 저장하는 Map
    accMap.set(MONTH, new Map());

    return accMap;
  }, new Map())

  // // let weekly_posts is 52 list
  // let weekly_posts = Array.from({ length: 53 }, () => []);

  // // 전체 포스팅 작성 날짜를 순회하면서, 해당 작성일의 주차를 계산
  // // '해당 주차'번째의 배열에, 작성일 문자열을 넣는다.
  // for (let k = 0; k < total_at.length; k++) {
  //   const current_post_date = total_at[k];  
  //   let date_split = current_post_date.split("-");
  //   let post_year = date_split[0];


  //   if (post_year !== String(year)) {
  //     continue;
  //   }
  //   let post_month = date_split[1];
  //   let post_day = date_split[2];

  //   /**
  //    * @notice JS의 Date객체는 month를 0 ~ 11로 인덱스함. 따라서 post_month -1 해준다.
  //    */
  //   let d = new Date(post_year, post_month - 1, post_day);
    
  //   weekly_posts[d.getWeek()].push(current_post_date);
  // }

  const monthToWeekMapSet = total_at.reduce((acc, cur_date_string) => {
    const date_split = cur_date_string.split("-");

    const [post_year, post_month, post_day] = date_split;

    if (post_year !== String(year)) {
      return acc;
    }

    /**
    * @notice JS의 Date객체는 month를 0 ~ 11로 인덱스함. 따라서 post_month -1 해준다.
    */
    const post_month_for_date_init = post_month - 1;
    // Date 객체 초기화 과정에서 UTC 기준 날짜가 뒤로 밀리는 이슈 발견
    // ex. 2024-06-02 문자열 입력 => postedDate가 2024-06-01T15:00:00이 된다.
    const postedDate = new Date(post_year, post_month_for_date_init, post_day);
    
    // KST에 맞춰 보정하여 이를 다시 06-02 Date로 돌리는 작업
    const formattedDateForKST = addHours(postedDate, 9);
    
    const monthAndWeekIdx = formattedDateForKST.getMonthWeek();
    
    const {month, week} = monthAndWeekIdx;

    const weekMap = acc.get(month);

    const valuesAlreadyIn = weekMap.get(week) ? weekMap.get(week) : [];
    weekMap.set(week, [...valuesAlreadyIn, formattedDateForKST]);

    acc.set(month, weekMap);

    return acc;
  }, initialMap);

  // 실제 잔디를 그리는 부분
  let days = Array.from({ length: MONTHS_IN_A_YEAR }, (_, i) => {
    return Array.from({ length: MAX_WEEKS_IN_A_MONTH }, (_, j) => {
      const EMPTY_DAY_CLASS_STRING = "day";
      const WRITTEN_DAY_CLASS_STRING = "writing";
      const NOT_EXISTS_WEEK_CLASS_STRING = "notExists"

      const currentMonth = i + 1;
      const currentWeekIdx = j + 1;

      const hasWritingInWeek = monthToWeekMapSet
                                .get(currentMonth)
                                .get(currentWeekIdx);

      // 해당 주차에 글이 있다면 rect의 class를 writing으로 지정
      // 그렇지 않다면 day로 지정
      let currentClass = hasWritingInWeek ? WRITTEN_DAY_CLASS_STRING : EMPTY_DAY_CLASS_STRING;
      
      const weeksOfCurMonth = getWeeksInMonth(year, currentMonth);

      // 근데 만약 해당 주차가 아예 존재하지 않으면, notExists로 지정
      currentClass = currentWeekIdx > weeksOfCurMonth 
                    ? NOT_EXISTS_WEEK_CLASS_STRING
                    : currentClass;

      let rect = `
        <rect 
          x="${25 + currentX + i * GRASS_HORIZONTAL_INTERVAL}" 
          y="${
            GRASS_DAILY_DEFAULT_VERTICAL_BLANK +
            currentY +
            j * GRASS_VERTICAL_INTERVAL
          }" 
          width="10" height="10" rx="2" class="${currentClass}"
        />
    `;
      return rect;
    }).join("");
  }).join("");

  return `
    <g data-testid="main-card-body" >
        <svg data-testid="contribution-chart" x="15"  >
            <g transform="translate(0, 0)">
                ${weekLabels}
                ${dayLabels}
                ${days}
            </g>
        </svg>
    </g>
  `;
};

const createBlograssCardBody = (total_at, type, year) => {
  if (type === "daily" || !type) {
    return createDailyGrass(total_at, year);
  } else if (type === "weekly") {
    return createWeeklyGrass(total_at, year);
  }
};

const BlograssStyle = `
    <style>
        .header {
            font: bold 14px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #343A40;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
        }
        .left-label { font-size: 12px; fill: #343A40; }
        .day-label { font-size: 12px; fill: #343A40; }
        .writing { font-size: 12px; fill:#20C997; stroke: #20C997; }
        rect.day { fill: #cae3db; stroke: #cae3db; }
        rect.notExists { fill: #ffffff; stroke: #ffffff }
    </style>
`;

/**
 * @description 외부에서 사용하는 메서드 
 * @description createBlograssCardTitle, createBlograssCardBody를 호출
 */
const createBlograssCard = (name, type, year, data, blogType) => {
  // get posts released_at, updated_at list
  const posts = data.posts;
  const released_at = posts.map((post) => post.released_at);
  const updated_at = posts.map((post) => post.updated_at);

  let total_at = [];
  total_at = released_at.concat(updated_at);

  // total_at의 T 이하 문자열 제거
  total_at = total_at.map((date) => date.split("T")[0]);

  // 중복 제거
  total_at = [...new Set(total_at)];

  // 테두리 크기 조정
  let width = 0;
  let height = 0;
  if (type === "daily" || !type) {
    width = DAILY_CARD_WIDTH;
    height = DAILY_CARD_HEIGHT;
  } else if (type === "weekly") {
    width = WEEKLY_CARD_WIDTH;
    height = WEEKLY_CARD_HEIGHT;
  }

  const today = new Date();
  const this_year = today.getFullYear();
  let year_check = year;
  if (year_check === this_year || !year_check) {
    year_check = this_year;
  } else {
    year_check = parseInt(year_check);
  }

  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
            ${BlograssStyle}
            <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="${
              width - 1
            }" fill="#fffefe" stroke-opacity="1"/>
            ${createBlograssCardTitle(name, type, year_check, blogType)}
            ${createBlograssCardBody(total_at, type, year_check)}
        </svg>
    `;
};

export default createBlograssCard;

