var router = require('express').Router();

router.get('/data',function(req,res,next){
  return res.json({data:'asdfasf'});
});

module.exports=router;