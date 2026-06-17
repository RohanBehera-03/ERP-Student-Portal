const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Student = require("./models/Student");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- DATABASE ---------------- */
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

/* ---------------- HOME PAGE ---------------- */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
/* ---------------- REGISTER ---------------- */
app.post("/submit", async (req, res) => {
    try {

        console.log("REGISTER DATA:", req.body);

        const existingUser = await Student.findOne({ email: req.body.email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        const student = new Student(req.body);
        await student.save();

        console.log("✅ Student Registered");

        res.json({
            success: true,
            message: "Registration Successful",
            redirect: "/login.html"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

/* ---------------- LOGIN ---------------- */
app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await Student.findOne({ email, password });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            redirect: `/studentData.html?id=${user._id}`  // 🔥 FIXED
        });

    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Server error"
        });
    }
});

/* ---------------- GET STUDENT BY ID ---------------- */
app.get("/api/student/:id", async (req, res) => {
    try {

        const id = req.params.id;

        if (!id || id === "undefined") {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error" });
    }
});

/* ---------------- UPDATE EDUCATION ---------------- */
app.post("/api/education/:id", async (req, res) => {
    try {
function cgpa(sec, total){
    sec = Number(sec);
    total = Number(total);

    if(!sec || !total || total === 0) return 0;

    return ((sec / total) * 10).toFixed(2);
}

        const updateData = {
            school10: req.body.school10,
            board10: req.body.board10,
            secured10: req.body.secured10,
            total10: req.body.total10,
            cgpa10: cgpa(req.body.secured10, req.body.total10),

            college12: req.body.college12,
            board12: req.body.board12,
            secured12: req.body.secured12,
            total12: req.body.total12,
            cgpa12: cgpa(req.body.secured12, req.body.total12),

            degree: req.body.degree,
            university: req.body.university,
            securedGrad: req.body.securedGrad,
            totalGrad: req.body.totalGrad,
            cgpaGrad: cgpa(req.body.securedGrad, req.body.totalGrad),

            course: req.body.course,
            semester: req.body.semester
        };

        const updated = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: "Education Updated Successfully",
            updated
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Update Failed"
        });
    }
});

/* ---------------- SERVER START ---------------- */
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running On Port ${PORT}`);
});