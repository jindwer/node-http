const http = require("http");
const fs   = require("fs");

var post;
var result   = null;
var response = null;
var href     = ["http://www.baidu.com","http://www.jd.com","http://www.mi.com","https://www.apple.com"];
var users;

getUsers();

var ser = http.createServer((req,res)=>{
  if((req.url === "/"||req.url === "/login")&&req.method==="GET"){
    fs.readFile('./login.html',"utf8",(err,data)=>{
      if(err){
        res.writeHead(500,{"Content-Type":"text/html"});
        res.end("Server is busy,please try again later!");
        return;
      }
      res.writeHead(200,{"Content-Type":"text/html"});
      res.end(data);
    });
  }else if(req.url === "/register"&&req.method==="GET"){
    fs.readFile('./register.html',"utf8",(err,data)=>{
      if(err){
        res.writeHead(500,{"Content-Type":"text/html"});
        res.end("Server is busy,please try again later!");
        return;
      }
      res.writeHead(200,{"Content-Type":"text/html"});
      res.end(data);
    });
    //登录
  }else if(req.url === "/login"&&req.method === "POST"){
    post     = "";
    result   = {};
    response = {};
    req.on("data",(chunk)=>{
      post += chunk;
    });
    req.on("end",()=>{
      post.replace(/([^&]+)=([^&]*)/g,(all,p1,p2)=>{
        result[p1]=p2;
      });
      res.writeHead(200,{"Content-Type":"text/plain"});
      if(users[result["name"]]&&users[result["name"]][0]==result["pwd"]){
        response.status = 1;
        response.nike   = users[result["name"]][1];
        response.href   = href[3];
      }else{
        response.status = 0;
      }
      res.end(JSON.stringify(response));
    });
    //注册
  }else if(req.url === "/register"&&req.method === "POST"){
    post     = "";
    result   = {};
    response = {};
    req.on("data",(chunk)=>{
      post += chunk;
    });
    req.on("end",()=>{
      post.replace(/([^&]+)=([^&]*)/g,(all,p1,p2)=>{
        result[p1]=p2;
      });
      res.writeHead(200,{"Content-Type":"text/plain"});
      if(users[result["name"]]){
         response.status = 0;
      }else{
         users[result["name"]]=[result["pwd"],result["nike"]];
         if(setUsers(JSON.stringify(users))){
           response.status = 1;
           response.nike   = result["nike"];
         }else{
           response.status = 2;
         }
      }
      res.end(JSON.stringify(response));
    });
  }else{
    res.writeHead(500,{"Content-Type":"text/html"});
    res.end("Server is busy,please try again later!");
  }
}).listen(3000);

function getUsers(){
  fs.readFile('./users.json',"utf8",(err,data)=>{
    if(err){
      console.log("The infomation of users can not get!");
    }else{
      users = JSON.parse(data);
    }
  });
}
function setUsers(data){
  var flag = true;
  fs.writeFile('./users.json',data,"utf8",(err)=>{
    if(err)flag = false;
  });
  return flag;
}
console.log("http://localhost:3000 is connected");
