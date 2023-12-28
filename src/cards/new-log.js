// https://velog.io/@dev-smile/posts

const createLatestCardTitle = (username) => {
  return `
    <g data-testid="card-title" transform="translate(25, 22)">
        <g transform="translate(0, 0)">
            <a href="https://velog.io/@${username}/posts">
                <text x="0" y="0" class="header" data-testid="header">${username}.log 's grass</text>
            </a>
        </g>
    </g>
    `;
};

const createLatestCardBody = (total_at) => {
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
        30 + currentX + index * 70
      }" y="50" class="month-label">${month}</text>
  `
    )
    .join("");

  let dayLabels = daysOfWeek
    .map(
      (day, index) => `
      <text x="0" y="${
        15 + currentY + index * 20
      }" class="day-label">${day}</text>
  `
    )
    .join("");

  let days = months
    .flatMap((month, monthIndex) => {
      let monthDays = Array.from(
        { length: daysInMonth[monthIndex] },
        (_, i) => {
          let writing = "";
          let year = "2023";
          const search_month = `${monthIndex + 1}`.padStart(2, "0");
          const search_day = `${i + 1}`.padStart(2, "0");

          // if date is in total_at, then writing = "writing"
          if (total_at.includes(`${year}-${search_month}-${search_day}`)) {
            console.log(
              "date :",
              `${year}-${search_month}-${search_day}`,
              total_at.includes(`${year}-${search_month}-${search_day}`)
            );
            writing = "writing";
          }

          let rect = `
          <rect x="${currentX + 5}" y="${
            5 + currentY + (dayCounter % 7) * 20
          }" width="10" height="10" class="day ${writing}"/>
      `;
          dayCounter++;
          if (dayCounter % 7 === 0) currentX += 15;
          return rect;
        }
      ).join("");

      currentX += 5; // Space between months
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
        .writing {fill:#20C997 !important;}
        rect.day { fill: #ebedf0; stroke: #ebedf0; }
    </style>
`;

const createLatestCard = (name, data) => {
  //   console.log("최근 글 ", data);
  //   console.log("최근 글 갯수 ", data.posts.length);
  // get posts released_at, updated_at list
  const posts = data.posts;
  const released_at = posts.map((post) => post.released_at);
  const updated_at = posts.map((post) => post.updated_at);
  //   console.log("released_at ", released_at);
  //   console.log("updated_at ", updated_at);
  let total_at = [];
  total_at = released_at.concat(updated_at);
  console.log("total_at ", total_at);
  // total_at의 T 이하 문자열 제거
  total_at = total_at.map((date) => date.split("T")[0]);
  // 중복 제거
  total_at = [...new Set(total_at)];

  return `
        <svg xmlns="http://www.w3.org/2000/svg" width="900" height="210" viewBox="0 0 900 210" fill="none">
            ${latestCardStyle}
            <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="899" fill="#fffefe" stroke-opacity="1"/>
            ${createLatestCardTitle(name)}
            ${createLatestCardBody(total_at)}
        </svg>
    `;
};

export default createLatestCard;
