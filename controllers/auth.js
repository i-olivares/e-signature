const mysql = require("mysql");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST, // IP adress in server
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm} = req.body;

  db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
    if(error){
      console.log(error)
    }else{
      if(results.length > 0){
        return res.render('register',{
          message: 'That email is already registered'
        })
      }else if ( password !== passwordConfirm){
        return res.render('register',{
          message: 'Passwords do not match'
        })
      }
    }

    let hashedID = await bcrypt.hash(email, 8);
    let hashedPassword = await bcrypt.hash(password, 8);

    console.log(hashedPassword);

    db.query('INSERT INTO users SET ?', {hashedID: hashedID,name: name,email: email, password: hashedPassword}, (error, results) =>{
      if(error){
        console.log(error)
      }else {
        console.log(results)
        req.session.user = results;
        req.session.opp = 0;

        console.log("req.session.opp defined as:")
        console.log(req.session.opp)
        return res.render('login',{
          message: 'User registered, please Sign in'
        })
      }

    })



  });

}


exports.login = async (req, res) => {


  try{

    const { email, password} = req.body;
    if(!email || !password){
      return res.status(400).render('login', {
        message: 'Please provide an email and password'
      })
    }
    console.log("IM at LOGIN before the query, this is the body:")
    console.log('email:',email)
    console.log('password:',password)
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error,results) => {
      console.log("Im inside the query, results are:")
      console.log(results)
      console.log('results.length:',results.length)
      if(results.length == 0){
        return res.status(401).render('login',{
          message: 'Email or password is incorrect'
        })
      }else if (!(await bcrypt.compare(password, results[0].password))) {
        return res.status(401).render('login',{
          message: 'Email or password is incorrect'
        })
      }else{
        req.session.user = results;
        req.session.opp= 1;
        console.log("req.session.opp defined as:")
        console.log(req.session.opp)

        const id = results[0].id;
        const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        })
        console.log("the token is: " + token)
        const cookieOptions = {
          expires: new Date(
            Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
          ),
          httpOnly: true
        }
        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect("/inhome")

      }
    })


  }catch (error){
    console.log(error)
  }


}
