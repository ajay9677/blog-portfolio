
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const validator = require("validator");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

app.use(express.json({ limit: "20kb" })); 

// MongoDB Schema
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 254 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);


const blogSchema = new mongoose.Schema({
  newTitle: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  newContent: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Blog = mongoose.model("Blog", blogSchema);


// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Check API
app.get("/", (req, res) => {
  res.send("Portfolio Contact API is running");
});

// Receive contact form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid contact details.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (
      !cleanName ||
      !cleanSubject ||
      !cleanMessage ||
      !validator.isEmail(cleanEmail) ||
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanSubject.length > 200 ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please check all fields and enter a valid email.",
      });
    }

    // Save details to MongoDB first
    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      emailStatus: "pending",
    });

    try {
      // Send notification to your Gmail
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_RECEIVER,
        replyTo: cleanEmail,
        subject: `Portfolio Contact: ${cleanSubject}`,
        text: `
You have received a new portfolio enquiry.

Name: ${cleanName}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}
        `,
      });

      contact.emailStatus = "sent";
      await contact.save();

      return res.status(201).json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);

      contact.emailStatus = "failed";
      await contact.save();

      // Message is saved even if email delivery fails
      return res.status(502).json({
        success: false,
        saved: true,
        message:
          "Your message was saved, but email delivery failed. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Contact API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process your message. Please try again later.",
    });
  }
});



/* GET ALL BLOGS */
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ _id: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Fetch blogs error:", error);
    res.status(500).json({
      message: "Unable to fetch blogs",
    });
  }
});

/* ADD NEW BLOG */
app.post("/api/blogs", async (req, res) => {
  try {
    const { newTitle, date, newContent } = req.body;

    if (
      typeof newTitle !== "string" ||
      typeof date !== "string" ||
      typeof newContent !== "string" ||
      !newTitle.trim() ||
      !date.trim() ||
      !newContent.trim()
    ) {
      return res.status(400).json({
        message: "Please enter blog title and content",
      });
    }

    const blog = await Blog.create({
      newTitle: newTitle.trim(),
      date: date.trim(),
      newContent: newContent.trim(),
      likes: 0,
    });

    res.status(201).json({
      message: "Blog added successfully",
      blog,
    });
  } catch (error) {
    console.error("Add blog error:", error);
    res.status(500).json({
      message: "Unable to add blog",
    });
  }
});

/* LIKE A BLOG */
app.patch("/api/blogs/like/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Like blog error:", error);
    res.status(500).json({
      message: "Unable to update likes",
    });
  }
});


// Start only after MongoDB connects
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (
      !process.env.MONGO_URI ||
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_APP_PASSWORD ||
      !process.env.CONTACT_RECEIVER
    ) {
      throw new Error("Missing required environment variables in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
