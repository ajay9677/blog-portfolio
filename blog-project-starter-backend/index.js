
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Resend } = require("resend");
const validator = require("validator");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "20kb" }));

// Contact Schema
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

const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);

// Blog Schema
const blogSchema = new mongoose.Schema({
  newTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
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

const Blog =
  mongoose.models.Blog ||
  mongoose.model("Blog", blogSchema);

// Gmail Transporter


// Home Route
app.get("/", (req, res) => {
  res.status(200).send("Portfolio API is running");
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Contact Form API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

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

    const contact = await Contact.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      emailStatus: "pending",
    });

        // Send email using Resend API
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_RECEIVER],
        replyTo: cleanEmail,
        subject: `Portfolio Contact: ${cleanSubject}`,
        text: `New portfolio enquiry

Name: ${cleanName}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}`,
      });

      if (error) {
        throw new Error(error.message || "Resend email failed");
      }

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

      return res.status(502).json({
        success: false,
        saved: true,
        message: "Your message was saved, but email delivery failed.",
      });
    
    }
  } catch (error) {
    console.error("Contact API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to process your message.",
    });
  }
});

// Get All Blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ _id: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Fetch blogs error:", error.message);
    return res.status(500).json({ message: "Unable to fetch blogs" });
  }
});

// Add New Blog
app.post("/api/blogs", async (req, res) => {
  try {
    const { newTitle, date, newContent } = req.body || {};

    if (
      typeof newTitle !== "string" ||
      typeof date !== "string" ||
      typeof newContent !== "string" ||
      !newTitle.trim() ||
      !date.trim() ||
      !newContent.trim()
    ) {
      return res.status(400).json({
        message: "Please enter blog title, date and content",
      });
    }

    const blog = await Blog.create({
      newTitle: newTitle.trim(),
      date: date.trim(),
      newContent: newContent.trim(),
      likes: 0,
    });

    return res.status(201).json({
      message: "Blog added successfully",
      blog,
    });
  } catch (error) {
    console.error("Add blog error:", error.message);
    return res.status(500).json({ message: "Unable to add blog" });
  }
});

// Like a Blog
app.patch("/api/blogs/like/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Like blog error:", error.message);
    return res.status(500).json({ message: "Unable to update likes" });
  }
});

// Start Server After MongoDB Connection
async function startServer() {
  try {
    const requiredVariables = [
  "MONGO_URI",
  "RESEND_API_KEY",
  "CONTACT_RECEIVER",
];

    const missingVariables = requiredVariables.filter(
      (key) => !process.env[key]
    );

    if (missingVariables.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingVariables.join(", ")}`
      );
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB Atlas Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
