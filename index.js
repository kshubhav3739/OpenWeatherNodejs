const fs = require("fs");
const http = require("http");
const request = require("requests");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temprature = tempVal.replace("{%temp%}", orgVal.main.temp);
  temprature = temprature.replace("{%temp_min%}", orgVal.main.temp_min);
  temprature = temprature.replace("{%temp_max%}", orgVal.main.temp_max);
  temprature = temprature.replace("{%temp_weather%}", orgVal.weather[0].main);
  temprature = temprature.replace("{%temp_city%}", orgVal.name);
  temprature = temprature.replace("{%temp_country%}", orgVal.sys.country);
  return temprature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    request(
      "http://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric &appid=d77403e48676cac13138ab9bb35a12cd"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        //   console.log(arrData[0].list[0].main.temp)
        const realTime = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        //   console.log(realTime);
        res.write(realTime);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});
server.listen(8000, "127.0.0.1");
