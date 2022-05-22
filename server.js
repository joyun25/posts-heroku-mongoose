const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const corsHeader = require("./corsHeader");
const { successHandle, errorHandle } = require("./responseHandle");
const Post = require("./models/post");

dotenv.config(
  { path: "./config.env" }
);

const DB = process.env.DATABASE.replace(
  "<databaseName>", process.env.DATABASE_NAME
).replace(
  "<password>", process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(
    () => { console.log("資料連線成功"); }
  )
  .catch(
    error => { console.log(error.reason); }
  )

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  if(req.url == "/posts" && req.method == "GET"){
    const allPosts = await Post.find();
    successHandle(res, allPosts);
  }else if(req.url == "/posts" && req.method == "POST"){
    req.on("end", async () => {
      try{
        const data = JSON.parse(body);
        const newPost = await Post.create({
          name: data.name,
          content: data.content
        });
        successHandle(res, newPost);
      }catch(err){
        errorHandle(res, 400, err.message);
      }
    });
  }else if(req.url == "/posts" && req.method == "DELETE"){
    await Post.deleteMany({});
    successHandle(res, Post);
  }else if(req.url.startsWith("/posts") && req.method == "DELETE"){
    const id = req.url.split("/").pop();
    if (await Post.findById(`${id}`) !== null){
      await Post.findByIdAndDelete(`${id}`);
      successHandle(res, "刪除成功");
    }else{
      errorHandle(res, 400, "無此筆資料");
    }
  }else if(req.url.startsWith("/posts") && req.method == "PATCH"){
    req.on("end", async () => {
      try{
        const id = req.url.split("/").pop();
        if (await Post.findById(`${id}`) !== null){
          const data = JSON.parse(body);
          if(data.content || data.name){
            const updatePost = await Post.findByIdAndUpdate(`${id}`, data);
            successHandle(res, updatePost);
          }else{
            errorHandle(res, 400, "請至少填寫姓名或內容");
          }
        }else{
          errorHandle(res, 400, "無此筆資料");
        }
      }catch(err){
        errorHandle(res, 400, err.message);
      }
    });
  }else if(req.method == "OPTIONS"){
    res.writeHead(200, corsHeader);
    res.end();
  }else{
    errorHandle(res, 404, "無此網站路由");
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);