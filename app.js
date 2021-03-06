const https = require('https');
const express = require('express');
const forceSsl = require('express-force-ssl');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const fs = require('fs');

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
    console.log('Database connected '+ config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('Database '+ err);
});

const app = express();

// include router files
const user = require('./routes/users');
const approver = require('./routes/approvers');
const company = require('./routes/companies');
const jd = require('./routes/jds');
const question = require('./routes/questions');
const scale = require('./routes/scales');
const header = require('./routes/headers');
const assessmenttype = require('./routes/assessmenttypes');
const jdquestion = require('./routes/jdquestions');
const organogram = require('./routes/organograms');
const department = require('./routes/departments');
const subdepartment = require('./routes/subdepartments');
const producttour = require('./routes/producttours');
const employee = require('./routes/employees');
const traininghead = require('./routes/trainingheads');
const trainingsubhead = require('./routes/trainingsubheads');
const budget = require('./routes/budgets');
const budgetplan = require('./routes/budgetplans');
const primaryemail = require('./routes/primaryemails');
const appraisal = require('./routes/appraisals');
const assessment = require('./routes/assessments');
const jdtoemployee = require('./routes/jdtoemployees');
const globalsetting = require('./routes/globalsettings');
const emailtemplate = require('./routes/emailtemplates');
const weightage = require('./routes/weightages');

// include fronend router files
const testimonial = require('./routes/frontend/testimonials');
const product = require('./routes/frontend/products');
const feature = require('./routes/frontend/features');
const faqcategory = require('./routes/frontend/faqcategories');
const faqsubcategory = require('./routes/frontend/faqsubcategories');
const faq = require('./routes/frontend/faqs');
const blog = require('./routes/frontend/blogs');
const productroadmap = require('./routes/frontend/productroadmaps');
const whitepaper = require('./routes/frontend/whitepapers');
const pressrelease = require('./routes/frontend/pressreleases');
const career = require('./routes/frontend/careers');
const contact = require('./routes/frontend/contacts');
const hrindex = require('./routes/frontend/hrindexs');

const common = require('./routes/frontend/commons');

const port = process.env.PORT || 3000;
/*
var options = {
    key: fs.readFileSync("./nationpulse.in.key"),
    cert: fs.readFileSync("./nationpulse_in.crt"),
};
const server = http.createServer((req, res) => {
    res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
    res.end();
});
server.listen(80);
https.createServer(options, app).listen(443);
app.use(forceSsl);
*/
app.use(cors()); // allow all
//app.use(cors({origin: 'http://localhost:4200'}));
/*
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
*/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public/images'));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// path set
app.use('/api/users', user);
app.use('/api/companies', company);
app.use('/api/approvers', approver);
app.use('/api/jds', jd);
app.use('/api/scales', scale);
app.use('/api/headers', header);
app.use('/api/questions', question);
app.use('/api/assessmenttypes', assessmenttype);
app.use('/api/jdquestions', jdquestion);
app.use('/api/organograms', organogram);
app.use('/api/departments', department);
app.use('/api/subdepartments', subdepartment);
app.use('/api/producttours', producttour);
app.use('/api/hrindexs', hrindex);
// frontend path
app.use('/api/testimonials', testimonial);
app.use('/api/products', product);
app.use('/api/features', feature);
app.use('/api/faqCategories', faqcategory);
app.use('/api/faqSubCategories', faqsubcategory);
app.use('/api/faqs', faq);
app.use('/api/blogs', blog);
app.use('/api/productroadmaps', productroadmap);
app.use('/api/whitepapers', whitepaper);
app.use('/api/pressreleases', pressrelease);
app.use('/api/careers', career);
app.use('/api/contacts', contact);
app.use('/api/employees', employee);
app.use('/api/trainingheads', traininghead);
app.use('/api/trainingsubheads', trainingsubhead);
app.use('/api/budgets', budget);
app.use('/api/budgetplans', budgetplan);
app.use('/api/primaryemails', primaryemail);
app.use('/api/appraisals', appraisal);
app.use('/api/commons', common);
app.use('/api/assessments', assessment);
app.use('/api/jdtoemployees', jdtoemployee);
app.use('/api/globalsettings', globalsetting);
app.use('/api/emailtemplates', emailtemplate);
app.use('/api/weightages', weightage);
/*
app.get('/', cors(corsOptions), (req, res) => {
    res.send('Invalied Endpoing');
});
*/
app.get('/', (req, res) => {
    res.send('Invalied Endpoing');
});

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});
app.get('*', function(req, res) {
    res.sendfile('/public/index.html');
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});
