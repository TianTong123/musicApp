import {req}  from "@/service/req";

// 音乐api
const api = {
  //获取音乐信息
  getMusic: data => req({
    method: "get",
    url: "music/getMusic",
    isOriginalGET: true,
    params: data
  }),
}

export default api