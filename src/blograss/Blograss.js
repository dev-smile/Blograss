// https://velog.io/@dev-smile/posts
const GRASS_DEFAULT_VERTICAL_BLANK = 5; // 잔디 기본 수직 공백
const GRASS_VERTICAL_INTERVAL = 15; // 잔디 수직 간격

const GRASS_DEFAULT_HORIZONTAL_BLANK = 5; // 잔디 기본 수평 공백
const GRASS_HORIZONTAL_INTERVAL = 15; // 잔디 수평 간격

const MONTH_DEFAULT_VERTICAL_BLANK = 15; // 월 기본 수직 공백
const MONTH_DEFAULT_HORIZONTAL_BLANK = 30; // 월 기본 수평 공백
const MONTH_HORIZONTAL_INTERVAL = 70; // 월간 간격
const MONTH_GAP = 4; // 월간 공백

const WEEK_DEFAULT_VERTICAL_BLANK = 15; // 주 기본 수직 공백

const createBlograssCardTitle = (username, type) => {
  let type_text = "";
  if (type === "daily" || !type) {
    type_text = "Daily";
  } else if (type === "weekly") {
    type_text = "Weekly";
  }
  return `
    <g data-testid="card-title" transform="translate(25, 22)">
        <g transform="translate(0, 0)">
            <a href="https://velog.io/@${username}/posts">
                <text x="0" y="0" class="header" data-testid="header">🌱 ${username}.log Velog ${type_text} Grass</text>
            </a>
        </g>
    </g>
    `;
};

const createDailyGrass = (total_at) => {
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
  // 윤년 추가 필요
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

const createWeeklyGrass = (total_at) => {
  // Show 52 weeks to 13*4 array
  let currentX = 25;
  let currentY = 55;
  let dayCounter = 0;
  let year = "2023";

  let weekLabels = Array.from({ length: 13 }, (_, i) => {
    return `
        <text x="${
          i < 9
            ? 7 + currentX + i * GRASS_HORIZONTAL_INTERVAL
            : 5 + currentX + i * GRASS_HORIZONTAL_INTERVAL
          // 7 + currentX + i * (i < 9 ? GRASS_VERTICAL_INTERVAL : 14)
        }" y="50" class="month-label">${i + 1}</text>
    `;
  }).join("");

  let dayLabels = Array.from({ length: 4 }, (_, i) => {
    return `
        <text x="10" y="${
          MONTH_DEFAULT_VERTICAL_BLANK + currentY + i * GRASS_VERTICAL_INTERVAL
        }" class="day-label">${i + 1}</text>
    `;
  }).join("");

  Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = (today - onejan + 86400000) / 86400000;
    return Math.ceil(dayOfYear / 7) - 1;
  };

  // let weekly_posts is 52 list
  let weekly_posts = Array.from({ length: 52 }, () => []);
  for (let k = 0; k < total_at.length; k++) {
    let date_split = total_at[k].split("-");
    let post_year = date_split[0];
    if (post_year !== year) {
      continue;
    }
    let post_month = date_split[1];
    let post_day = date_split[2];

    let d = new Date(post_year, post_month - 1, post_day);

    weekly_posts[d.getWeek() - 1].push(total_at[k]);
  }

  let days = Array.from({ length: 13 }, (_, i) => {
    return Array.from({ length: 4 }, (_, j) => {
      let writing = "day";
      const search_month = `${i + 1}`.padStart(2, "0");
      const search_day = `${j + 1}`.padStart(2, "0");

      // total_at.map((date) => {
      //   let date_split = date.split("-");
      //   let year = date_split[0];
      //   let month = date_split[1];
      //   let day = date_split[2];

      //   let d = new Date(year, month - 1, day);

      //   // console.log("d :", d);
      //   // console.log("d.getWeek() :", d.getWeek());
      //   // console.log("d.getWeek() - 1 :", d.getWeek() - 1);
      //   // console.log(
      //   //   "weekly_posts[d.getWeek() - 1] :",
      //   //   weekly_posts[d.getWeek() - 1]
      //   // );
      //   weekly_posts[d.getWeek() - 1].push(date);
      // });

      // if (total_at.includes(`${year}-${search_month}-${search_day}`)) {
      //   // console.log(
      //   //   "date :",
      //   //   `${year}-${search_month}-${search_day}`,
      //   //   total_at.includes(`${year}-${search_month}-${search_day}`)
      //   // );
      //   writing = "writing";
      // }
      if (weekly_posts[i * 4 + j].length > 0) {
        writing = "writing";
      }

      let rect = `
        <rect 
          x="${
            GRASS_DEFAULT_HORIZONTAL_BLANK +
            currentX +
            i * GRASS_HORIZONTAL_INTERVAL
          }" 
          y="${
            GRASS_DEFAULT_VERTICAL_BLANK +
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

const createBlograssCardBody = (total_at, type) => {
  if (type === "daily" || !type) {
    return createDailyGrass(total_at);
  } else if (type === "weekly") {
    return createWeeklyGrass(total_at);
  }
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
        rect.day { fill: #cae3db; stroke: #ebedf0; }
    </style>
`;

const createBlograssCard = (name, type, data) => {
  // 발행일, 수정일 색 구분하여 표시해도 좋을 것 같다.

  // console.log("최근 글 ", data);
  // console.log("최근 글 갯수 ", data.posts.length);

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
    width = 900;
    height = 170;
  } else if (type === "weekly") {
    width = 270;
    height = 130;
  }

  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
            ${latestCardStyle}
            <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="${
              width - 1
            }" fill="#fffefe" stroke-opacity="1"/>
            ${createBlograssCardTitle(name, type)}
            ${createBlograssCardBody(total_at, type)}
        </svg>
    `;
};

export default createBlograssCard;
