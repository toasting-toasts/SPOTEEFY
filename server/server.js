const express = require("express");
const cors = require("cors")
const db = require("./db.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const music_metadata = require("music-metadata");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "key";

const app = express();
app.use(cors({
    origin: "*",
    allowedHeaders: "*",
    methods: "*"
}))

app.use(express.static("static"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "audio") cb (null, "static/audio")
        else if (file.fieldname === "cover") cb (null, "static/covers")
        else cb (new Error("Invalid field name"), null)
        
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname === "audio" && file.mimetype.startsWith("audio/")) cb (null, true);
        else if (file.fieldname === "cover" && file.mimetype.startsWith("image/")) cb (null, true);
        else cb (new Error("Invalid file type"), false);
    },
    limits: {fileSize: 50 * 1024 * 1024} //50MB
})

function validateRegister(email, username, password){
    if(!email || !username || !password){
        return {error: "Missing required fields"}
    }
    if(typeof email !== "string" || typeof username !== "string" || typeof password !== "string"){
        return {error: "Internal server error"}
    }
    if(!username.match(/^[a-zA-Z0-9_]+$/)){
        return {error: "Username can only contain letters, numbers and underscores"}
    }
    if(username.length < 3 || username.length > 20){
        return {error: "Username must be at bigger than 3 characters but smaller than 20 characters"}
    }
    if(!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        return {error: "Invalid email format"}
    }
    if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)){
        return {error: "Password must contain at least one letter and one number"}
    }
    return null;
}

function validateLogin(username, password){
    if(!username || !password){
        return {error: "Missing required fields"}
    }
    if(typeof username !== "string" || typeof password !== "string"){
        return {error: "Internal server error"}
    }
    if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)){
        return {error: "Password must contain at least one letter and one number"}
    }
    if(!username.match(/^[a-zA-Z0-9_]+$/)){
        return {error: "Username can only contain letters, numbers and underscores"}
    }
    if(username.length < 3 || username.length > 20){
        return {error: "Username must be at bigger than 3 characters but smaller than 20 characters"}
    }
    return null;
}

function validateAudioSubmission(files, body){
    if(!files || !files.audio || files.audio.length === 0){
        return {error: "Audio file is required"}
    }
    if(typeof body.title !== "string" || typeof body.author !== "string" || typeof body.description !== "string"){
        return {error: "Internal server error"}
    }
    if(body.title.length === 0 || body.author.length === 0){
        return {error: "Title and author are required"}
    }
    if(body.title.length > 30){
        return {error: "Title must be smaller than 30 characters"}
    }
    if(body.author.length > 30){
        return {error: "Author must be smaller than 30 characters"}
    }
    if(body.description.length > 500){
        return {error: "Description must be smaller than 500 characters"}
    }
    return null;
}

async function loginQuery(username, password){
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if(rows.length === 0) return {error: "Invalid username or password"};
        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if(!passwordMatch) return {error: "Invalid username or password"};

        const token = jwt.sign({username: user.username, id: user.id}, JWT_SECRET, {expiresIn: "2d"});
        return {message: `Welcome back, ${username}!`, token};
    } catch (err) {
        return {error: "Internal server error"};
    }
}
async function registerQuery(email, username, password){
    const hash = await bcrypt.hash(password, 12);

    try {
        const [result] = await db.query("INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)", [email, username, hash]);
        const token = jwt.sign({username: username, id: result.insertId}, JWT_SECRET, {expiresIn: "2d"});
        return {message: `Welcome, ${username}! Your account has been created.`, token};
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return {error: "Username or email already exists"};
        }
        return {error: "Internal server error"};
    }
}

async function uploadQuery(files, body, user){
    const audioFile = files.audio[0];
    const coverFile = files.cover ? files.cover[0] : null;

    const metadata = await music_metadata.parseFile(audioFile.path);
    const duration = Math.round(metadata.format.duration);

    const audioPath = `/audio/${audioFile.filename}`;
    const coverPath = coverFile ? `/covers/${coverFile.filename}` : "/covers/default_cover.jpg";

    const {title, author, description} = body;

    try {
        const [result] = await db.query(
            "INSERT INTO tracks (uploader_id, title, author, description, audio_path, cover_path, duration_s) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [user.id, title, author, description, audioPath, coverPath, duration]
        );
        return {message: "Files uploaded successfully", trackId: result.insertId};
    } catch (err) {
        return {error: "Internal server error"};
    }
}
function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({error: "Unauthorized"});

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({error: "Forbidden"});
        req.user = user;
        next();
    })
}

app.post("/auth/register", async (req, res) => {

    const {email, username, password} = req.body;
    const validationError = validateRegister(email, username, password);
    if(validationError) return res.status(400).json(validationError)
    
    const registerResult = await registerQuery(email, username, password);
    if(registerResult.error) return res.status(500).json(registerResult)

    return res.json(registerResult)
})

app.post("/auth/login", async (req, res) => {
    const {username, password} = req.body;
    const validationError = validateLogin(username, password);
    if(validationError) return res.status(400).json(validationError)
    
    const loginResult = await loginQuery(username, password);
    if(loginResult.error) return res.status(401).json(loginResult);

    return res.json(loginResult)
})

app.post(
    "/audio/submit", authenticateToken, 
    upload.fields([   {name: "audio", maxCount: 1}, {name: "cover", maxCount: 1}   ]), 
    async (req, res) => {

    const validationError = validateAudioSubmission(req.files, req.body);
    if(validationError) return res.status(400).json(validationError);

    const uploadResult = await uploadQuery(req.files, req.body, req.user);
    if(uploadResult.error) return res.status(500).json(uploadResult);

    return res.json(uploadResult)
})

app.get("/auth/me", authenticateToken, async (req, res) => {
    const user = req.user;
    return res.json({username: user.username, id: user.id});
})

app.listen(3000, () => console.log("Server started on port 3000"));