// https://velog.io/@dev-smile/posts
const GRASS_DEFAULT_VERTICAL_BLANK = 5; // 잔디 기본 수직 공백
const GRASS_VERTICAL_INTERVAL = 15; // 잔디 수직 간격

const GRASS_DEFAULT_HORIZONTAL_BLANK = 5; // 잔디 기본 수평 공백
const GRASS_HORIZONTAL_INTERVAL = 15; // 잔디 수평 간격

const MONTH_DEFAULT_VERTICAL_BLANK = 15; // 월 기본 수직 공백
const MONTH_DEFAULT_HORIZONTAL_BLANK = 30; // 월 기본 수평 공백
const MONTH_HORIZONTAL_INTERVAL = 70; // 월간 간격
const MONTH_GAP = 4; // 월간 공백

const createBlograssCardTitle = (username) => {
  return `
    <g data-testid="card-title" transform="translate(25, 22)">
        <g transform="translate(0, 0)">
            <a href="https://velog.io/@${username}/posts">
                <text x="0" y="0" class="header" data-testid="header">🌱 ${username}.log Velog Grass</text>
            </a>
        </g>
    </g>
    `;
};

const createBlograssCardBody = (total_at) => {
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
  let currentX = 25;
  let currentY = 55;
  let dayCounter = 0;

  let monthLabels = months
    .map(
      (month, index) => `
      <text x="${
        MONTH_DEFAULT_HORIZONTAL_BLANK +
        currentX +
        index * MONTH_HORIZONTAL_INTERVAL
      }" y="50" class="month-label">${month}</text>
  `
    )
    .join("");

  let dayLabels = daysOfWeek
    .map(
      (day, index) => `
      <text x="0" y="${
        MONTH_DEFAULT_VERTICAL_BLANK +
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
          let year = "2023";
          const search_month = `${monthIndex + 1}`.padStart(2, "0");
          const search_day = `${i + 1}`.padStart(2, "0");

          // if date is in total_at, then writing = "writing"
          if (total_at.includes(`${year}-${search_month}-${search_day}`)) {
            // console.log(
            //   "date :",
            //   `${year}-${search_month}-${search_day}`,
            //   total_at.includes(`${year}-${search_month}-${search_day}`)
            // );
            writing = "writing";
          }

          let rect = `
          <rect 
            x="${GRASS_DEFAULT_HORIZONTAL_BLANK + currentX}" 
            y="${
              GRASS_DEFAULT_VERTICAL_BLANK +
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

      currentX += MONTH_GAP; // Space between months
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

const latestCardStyle = `
    <style>
        .header {
            font: bold 14px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #343A40;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
        }
        .month-label { font-size: 12px; fill: #343A40; }
        .day-label { font-size: 12px; fill: #343A40; }
        .writing { font-size: 12px; fill:#20C997; }
        rect.day { fill: #ebedf0; stroke: #ebedf0; }
    </style>
`;

const createBlograssCard = (name, data) => {
  //   console.log("최근 글 ", data);
  //   console.log("최근 글 갯수 ", data.posts.length);
  // get posts released_at, updated_at list
  const posts = data.posts;
  const released_at = posts.map((post) => post.released_at);
  const updated_at = posts.map((post) => post.updated_at);

  let total_at = [];
  total_at = released_at.concat(updated_at);

  // 발행일, 수정일 색 구분하여 표시해도 좋을 것 같다.

  // total_at의 T 이하 문자열 제거
  total_at = total_at.map((date) => date.split("T")[0]);
  // 중복 제거
  total_at = [...new Set(total_at)];

  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="900" height="170" viewBox="0 0 900 170" fill="none">
            ${latestCardStyle}
            <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="899" fill="#fffefe" stroke-opacity="1"/>
            ${createBlograssCardTitle(name)}
            ${createBlograssCardBody(total_at)}
        </svg>
    `;
};

export default createBlograssCard;
