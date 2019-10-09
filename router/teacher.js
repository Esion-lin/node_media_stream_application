const router = require("express").Router();
const urlhix = require("../config.js").streamUrl;
const myconnect = require("../mysqlConnection");
const utilLib = require("../libs/commen.js");
const fs = require("fs");
const gm = require("gm");
//TODO
//添加课程
//需要分配推流URL
router.use((req,res,next)=>{
	if(typeof req.session.user == "undefined"){
		res.render('login.ejs');
		res.end();
		return;
	}else{
		next();
	}
});
router.use('/addCourses',(req,res)=>{
  //随机生成推流URL
  var newurl = utilLib.chgpwd(req.body.name+req.body.description,'');
  var oldname = './staticfile/upload/'+req.file.filename;
	var newname = './staticfile/upload/'+req.file.filename+'.jpg';
  fs.rename(oldname, newname, function(err){
        if (err){
        	console.log('err is ',err);
        	res.writeHead(500, {'Location': './public/500.html'});
        	res.end();
        	return
        }
        else{
	        gm(newname).size(function (err, size) {
	          if (err){
	            console.log('err is ',err);
	          }
	          var cropsize = size.width > size.height ? size.height : size.width;
	          gm(newname).crop(cropsize, cropsize, 0, 0)
	                      .write(newname,function(err){
	                        if(err) console.log('err is ',err);
	                      });

	        });
	        myconnect.client.query(`Insert into courses_table(name,description,url,src,teach_id) values('${req.body.name}','${req.body.description}','${newurl}','${req.file.filename+'.jpg'}','${req.session.user.ID}')`,(err,results)=>{
	    				if (err) {
	    					console.log('err is ',err);
	    					res.writeHead(500, {'Location': './public/500.html'});
	            	return

	    				}
	    				res.render('Teach/addsuccess.ejs',{url:urlhix+newurl,user:req.session.user});
	    				res.end();
		      });
	    	}
    });
});

//TODO
//为课程添加学生


module.exports = router;
