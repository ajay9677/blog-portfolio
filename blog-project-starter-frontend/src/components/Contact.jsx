
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "./common/Footer";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setFeedback({ type: "", message: "" });

  if (loading) return;

  setLoading(true);

  try {
    
const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const response = await axios.post(
  `${API_URL}/api/contact`,
  formData
);

  

    setFeedback({
      type: "success",
      message: response.data.message || "Message sent successfully!",
    });

    setFormData(initialForm);
  } catch (error) {
    setFeedback({
      type: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to send your message. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-white-950 px-5 py-12 text-black">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-12 flex items-center justify-between">
         

          <Link
            to="/home"
            className="rounded-lg body  border border-slate-700 px-5 py-2 hover:border-cyan-400 " 
          >
            Home
          </Link>
        </nav>

        <header className="mb-12 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-400">
            Get In Touch
          </p>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Contact <span className="text-cyan-400">Me</span>
          </h1>

          <p className="mx-auto max-w-xl text-black-400">
            Have a project or job opportunity? Send me a message.
            I would love to hear from you.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h2 className="mb-5 text-2xl font-bold text-cyan-400 ">Let's Connect</h2>

            <p className="mb-8 leading-7 text-slate-400">
              Feel free to contact me about full stack development,
              internships, collaborations, and project opportunities.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-cyan-400">Email</h3>
                <p className="mt-1 break-all text-slate-400">
                  ajay7667826711@gmail.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-cyan-400">LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/ajays10/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-slate-400 hover:text-cyan-400"
                >
                  Visit my LinkedIn
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-cyan-400">GitHub</h3>
                <a
                  href="https://github.com/ajay9677"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-slate-400 hover:text-cyan-400"
                >
                  Visit my GitHub
                </a>
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
          >
            <h2 className="mb-6 text-2xl font-bold text-cyan-400">
              Send Me a Message
            </h2>

            {feedback.message && (
              <div
                role="status"
                aria-live="polite"
                className={`mb-5 rounded-lg border p-4 text-sm ${
                  feedback.type === "success"
                    ? "border-green-700 bg-green-950 text-green-300"
                    : "border-red-700 bg-red-950 text-red-300"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="name" className="mb-2 block text-sm text-cyan-400">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="mb-2 block text-sm text-cyan-400">
                Your Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="subject" className="mb-2 block text-sm text-cyan-400">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                maxLength={200}
                value={formData.subject}
                onChange={handleChange}
                placeholder="Job opportunity / Project"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="mb-2 block text-sm text-cyan-400">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={5000}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>
          </form>
        </div>

        <hr></hr>
        <Footer/>
      </div>
    </main>

    
  );
}

export default Contact;
