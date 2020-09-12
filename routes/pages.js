const express = require("express")

const router = express.Router();

router.get('/', (req,res) =>{
  let user = req.session.user;
  if(user){
    res.redirect('/inhome')
    return;
  }
  res.render('home');
});

router.get('/register', (req,res) =>{
  res.render('register');
});

router.get('/login', (req,res) =>{
  res.render('login');
});

router.get('/inhome', (req,res) =>{
  let user = req.session.user;
  if(user) {
    res.render('inhome', {opp:req.session.opp, name: user[0].name });
    return;
  }
  res.redirect('/');
});


router.get('/sign', (req,res) =>{
  let user = req.session.user;
  if(user) {
    res.render('sign', {hashedID:user[0].hashedID,email:user[0].email, name: user[0].name });
    return;
  }
  res.redirect('/');
});


router.get('/loggout', (req,res) =>{
  if (req.session.user){
    req.session.destroy(() =>{
      res.redirect('/')
    })
  }
});


module.exports = router;
