import axios from "axios";

export function request(data) {
  return axios({
    url: "https://v2.velog.io/graphql",
    method: "post",
    data,
  });
}
