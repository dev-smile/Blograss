// 공백 및 간격을 위한 상수

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
const WEEKLY_CARD_HEIGHT = 130; // 카드 높이
const WEEK_LABEL_UNDER_10_BLANK = 27; // 주 라벨 10 미만 수평 공백
const WEEK_LABEL_OVER_10_BLANK = 25; // 주 라벨 10 이상 수평 공백 (2자리 숫자로 간격이 달라짐)

const createBlograssCardTitle = (username, type, year) => {
  let type_text = "";
  if (type === "daily" || !type) {
    type_text = "Daily";
  } else if (type === "weekly") {
    type_text = "Weekly";
  }
  const title_text = `🌱 ${year}년 Velog ${username} ${type_text} Grass`;

  return `
    <g data-testid="card-title" transform="translate(25, 22)">
        <g transform="translate(0, 0)">
            <a href="https://velog.io/@${username}/posts">
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

const createWeeklyGrass = (total_at, year) => {
  // Show 52 weeks to 13*4 array
  let currentX = START_X;
  let currentY = START_Y;

  let weekLabels = Array.from({ length: 13 }, (_, i) => {
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

  let dayLabels = Array.from({ length: 4 }, (_, i) => {
    return `
        <text x="30" y="${
          LEFT_LABEL_DEFAULT_VERTICAL_BLANK +
          currentY +
          i * GRASS_VERTICAL_INTERVAL
        }" class="day-label" text-anchor="middle">${i + 1}</text>
    `;
  }).join("");

  Date.prototype.getWeek = function () {
    // get week number
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = (today - onejan + 86400000) / 86400000;
    return Math.ceil(dayOfYear / 7) - 1;
  };

  // let weekly_posts is 52 list
  let weekly_posts = Array.from({ length: 53 }, () => []);
  for (let k = 0; k < total_at.length; k++) {
    let date_split = total_at[k].split("-");
    let post_year = date_split[0];
    console.log("post_year :", post_year);
    if (post_year !== String(year)) {
      continue;
    }
    let post_month = date_split[1];
    let post_day = date_split[2];

    let d = new Date(post_year, post_month - 1, post_day);
    weekly_posts[d.getWeek()].push(total_at[k]);
  }

  let days = Array.from({ length: 13 }, (_, i) => {
    return Array.from({ length: 4 }, (_, j) => {
      let writing = "day";

      if (weekly_posts[i * 4 + j].length > 0) {
        writing = "writing";
      }

      let rect = `
        <rect 
          x="${25 + currentX + i * GRASS_HORIZONTAL_INTERVAL}" 
          y="${
            GRASS_DAILY_DEFAULT_VERTICAL_BLANK +
            currentY +
            j * GRASS_VERTICAL_INTERVAL
          }" 
          width="10" height="10" rx="2" class="${writing}"
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
    </style>
`;

const createBlograssCard = (name, type, year, data) => {
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
            ${createBlograssCardTitle(name, type, year_check)}
            ${createBlograssCardBody(total_at, type, year_check)}
        </svg>
    `;
};

export default createBlograssCard;
