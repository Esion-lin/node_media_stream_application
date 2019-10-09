//这个文件用于处理公共查询

const router = require("express").Router();
const myconnect = require("../mysqlConnection");
const fs = require("fs");

router.use('/courses',(req,res)=>{
  var page_num = req.body.page_num;
  var count_num = req.body.count_num;
  myconnect.client.query(`Select ID,name,description,src,teach_id FROM courses_table LIMIT ${req.body.page_num*req.body.count_num},${req.body.count_num}`,(err,results)=>{
      if (err) {
        console.log('err is ',err);
        res.writeHead(500, {'Location': './public/500.html'});
        return
      }else{
        res.send({
          msg:"query successfully",
          courses:results
        });
        res.end();
      }
  });
});
router.use('/mycourses',(req,res)=>{
  var userid = req.session.user.ID;
  var page_num = req.body.page_num;
  var count_num = req.body.count_num;
  myconnect.client.query(`select * from courses_table where ID in ( select course_id from report_u_c where user_id = ${userid}) LIMIT ${req.body.page_num*req.body.count_num},${req.body.count_num}`,(err,results)=>{
      if (err) {
        console.log('err is ',err);
        res.writeHead(500, {'Location': './public/500.html'});
        return
      }else{
        res.send({
          msg:"query successfully",
          courses:results
        });
        res.end();
      }
  });
});
router.use('/courses_del',(req,res)=>{
  var teach_id = req.body.teach_id;
  var course_id = req.body.course_id;
  var course_src = req.body.course_src;
  if(typeof req.session.user == "undefined"){
    res.render(login.ejs);
    res.end();
    return;
  }else{
    if(req.session.user.ID != teach_id){
      res.send({
        code:-1,
        msg:"query fail"
      });
      res.end();
      return;
    }
  }
  myconnect.client.query(`DELETE FROM courses_table WHERE ID=${course_id} and teach_id=${teach_id}`,(err,results)=>{
      if (err) {
        console.log('err is ',err);
        res.send({
          code:0,
          msg:"delete fail"
        });
      }else{
        fs.unlink('./staticfile/upload/'+course_src,function (err){
          if(err) throw err;
        });
        res.send({
          code:100,
          msg:"query successfully"
        });

      }
      res.end();
  });
})
router.use('/courses_teach',(req,res)=>{
  var page_num = req.body.page_num;
  var count_num = req.body.count_num;
  var teach_id = req.body.teach_id;
  if(typeof req.session.user == "undefined"){
    res.render(login.ejs);
    res.end();
    return;
  }else{
    if(req.session.user.ID != teach_id){
      res.send({
        msg:"query fail"
      });
      res.end();
      return;
    }
  }
  myconnect.client.query(`Select * FROM courses_table WHERE teach_id=${teach_id} LIMIT ${page_num*count_num},${count_num}`,(err,results)=>{
      if (err) {
        console.log('err is ',err);
        res.writeHead(500, {'Location': './public/500.html'});
        return
      }else{
        res.send({
          msg:"query successfully",
          courses:results
        });
        res.end();
      }
  });
});
module.exports = router;
