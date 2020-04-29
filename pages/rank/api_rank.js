import {req}  from "@/service/req";

// 排行榜api
const api = {
  //获取排行榜
  getRank: data => req({
    method: "get",
    url: "music-rank",
    isOriginalGET: true,
    params: data
  }),
}

export default api