const express = require('express');
const multer = require('multer');
const path = require('path');

const userRelatedRoutes = require('./routes/userRouter');
const techSupportRelatedRoutes = require('./routes/techSupportRouter');
const adminRelatedRoutes = require('./routes/adminRouter');
const loginRelatedroutes = require('./routes/loginRouter');

const app = express();
const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use((request, response, next)=>{
    response.setHeader('Access-Control-Allow-Origin',"*");
    response.setHeader('Access-Control-Allow-Headers',"*");
    response.setHeader('Access-Control-Allow-Methods', "*")
    next();
})

app.use(express.json());


app.use('/admin',adminRelatedRoutes);
app.use('/techsupport',techSupportRelatedRoutes);
app.use('/user',userRelatedRoutes);
app.use('/login',loginRelatedroutes);


app.post('/upload', upload.single('file'), (req,res) => {
    if(!req.file){
        return res.status(404).json({ message: 'No File Uploaded'});

    }

    res.status(200).json({ message: 'File uploaded Successfully', filename : req.file.filename});
});


app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});


