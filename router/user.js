const router = require("express").Router();
const myconnect = require("../mysqlConnection");
const utilLib = require("../libs/commen.js");
const hix = require("../config");
const fs = require("fs");
const gm = require("gm");

router.use('/login',(req,res)=>{
	res.render('login.ejs');
});
router.use('/loginact',(req,res)=>{
	//console.log("SELECT * FROM user_table WHERE user='"+req.body.username + "'");
	if(typeof(req.body.username) == 'undefined'){
		res.render('login.ejs');
		return;
	}
	myconnect.client.query("SELECT * FROM user_table WHERE email='"+req.body.username + "'",(err,results,fields)=>{
		if (err) {
			console.log('err is ',err);
			res.writeHead(500, {'Location': './public/500.html'});
			res.end();
		    throw err;
		}
	    if(results.length != 0)
	    {
	    	console.log(results);
	    	if(results[0].pwd == utilLib.chgpwd(req.body.pass,hix.md5hex)){
	    		//校验密码成功

	    		req.session.user = results[0];
	    		res.render('index.ejs',{user:results[0]});
	    	}else{
	    		res.render('login.ejs',{tip:true});
	    	}
	    }else{
	    	res.render('login.ejs',{tip:true});
	    }
	    res.end();
	});


});
router.use('/regist',(req,res,next)=>{
	var newpwd = utilLib.chgpwd(req.body.pass,hix.md5hex);
	//console.log(req.file);
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
						if (!err){
							var cropsize = size.width > size.height ? size.height : size.width;
							gm(newname).crop(cropsize, cropsize, 0, 0).write(newname,function(err){
								if(err) console.log('err is ',err);
							});
						}
					});
          myconnect.client.query(`Insert into user_table(user,pwd,email,type,src) values('${req.body.username}','${newpwd}','${req.body.email}',1,'${req.file.filename}.jpg')`,(err,results)=>{
						if (err) {
							console.log('err is ',err);
							res.writeHead(500, {'Location': './public/500.html'});
		        			return

						}
						res.render('login.ejs',{isreg:true});
						res.end();
					});
      }
  });


});
router.use('/check',(req,res,next)=>{
	myconnect.client.query("SELECT * FROM user_table WHERE email='"+req.body.email + "'",(err,results,fields)=>{
		if (err) {
			console.log('err is ',err);
		    throw err;
		}
	    if(results.length != 0)
	    {
	    	res.send({"isReg":true});
	    }else{
	    	res.send({"isReg":false});
	    }
	    res.end();
	});
});
router.use((req,res,next)=>{
	if(typeof req.session.user == "undefined"){
		res.render('login.ejs');
		res.end();
		return;
	}else{
		next();
	}
});
router.use('/mycourses',(req,res)=>{
	if(req.session.user.type == 1){
		res.render('mycourse.ejs',{user:req.session.user});
	}
	res.end();
});
router.use('/editInfo',(req,res)=>{
	var userID = req.session.user.ID;
	myconnect.client.query("SELECT * FROM user_table WHERE ID="+userID + "",(err,results,fields)=>{
		if (err) {
			console.log('err is ',err);
		    throw err;
		}
		if(results.length != 0)
		{
			if(typeof(req.file)!='undefined'){
				var oldfile = './staticfile/upload/'+results[0].src;
				fs.unlink(oldfile,function (err) {
					if(err) throw err;
					var oldname = './staticfile/upload/'+req.file.filename;
					var newname = './staticfile/upload/'+req.file.filename+'.jpg';
					fs.rename(oldname, newname, function(err){
				        if (err){
				        	console.log('err is ',err);
									throw err;
				        }
				        else{
				            myconnect.client.query(`Update user_table Set user='${req.body.username}',description='${req.body.description}',src='${req.file.filename}.jpg' where ID=${userID}`,(err,results)=>{
											if (err) {
												console.log('err is ',err);
												res.sendFile('./staticfile/500.html');
							        			return
											}
											res.render('login.ejs');
											res.end();
										});
				        }
				    });
				})
			}else{
				myconnect.client.query(`Update user_table Set user='${req.body.username}',description='${req.body.description}' where ID=${userID}`,(err,results)=>{
					if (err) {
						console.log('err is ',err);
						res.sendFile('./staticfile/500.html');
								return
					}
					res.render('login.ejs');
					res.end();
				});
			}

		}else{
			res.sendFile('./staticfile/404.html');
		}
	});
});
router.use('/logout',(req,res)=>{
		req.session = null;
		res.render('login.ejs');
		res.end();
});

router.use('/profile',(req,res)=>{
		//若登陆判断是老师还是学生
		if(req.session.user.type == 1)
			res.render('profile.ejs',{user:req.session.user});
		else
			res.render('teach/profile.ejs',{user:req.session.user,urlHix:hix.streamUrl});
		res.end();
		return
});


function check(){
	return true;
}
router.get('/getcourse',(req,res)=>{
	var course_id = req.query.course_id;
	if(typeof(course_id)=='undefined'){
		res.sendFile('./staticfile/404.html');
	}
	if(check()){
		myconnect.client.query(`SELECT * FROM courses_table WHERE ID=${course_id}`,(err,results,fields)=>{
			if (err) {
				console.log('err is ',err);
			    throw err;
			}
		    if(results.length != 0)
		    {
					res.render("course3.ejs",{user:req.session.user,course:results[0],urlHix:hix.streamUrl,urlHixFlv:hix.streamUrlFlv});
					res.end();
		    }else{
					res.sendFile('./staticfile/404.html');
					res.end();
		    }
		    res.end();
		});

	}else{

	}
});

router.use((req,res,next)=>{
		res.render('index.ejs',{user:req.session.user});
});
module.exports = router;
