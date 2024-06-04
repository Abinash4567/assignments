const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db");

// Admin Routes
router.post('/signup', async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        const admin = await Admin.findOne({
            username: username,
            password: password
        });

        if(admin===null)
        {
            res.status(400).json({
                msg: "Admin already exists"
            })
        }

        const newUser = await Admin.create({
            username,
            password
        })

        res.json({
            message: 'Admin created successfully',
            user: newUser
        });
    }
    catch(err)
    {
        res.status(400).json({
            error: err
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    // zod
    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const response = await Course.find({});

    res.json({
        courses: response
    })
});

module.exports = router;