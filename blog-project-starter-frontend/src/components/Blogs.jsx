import React, { useEffect } from 'react'
import { useState } from 'react';

import axios from "axios"
import Footer from './common/Footer';
import auth from '../config/firebase';


const API_URL = process.env.REACT_APP_API_URL;
function Blogs() {

    const [blogs, setBlogs] = useState([]);
    const [admin,setAdmin] = useState(false);

   useEffect(() => {
    window.scrollTo(0, 0);

    const unsubscribe = auth.onAuthStateChanged((user) => {
        setAdmin(
            user?.uid === "dl0dFITlFXbKElyTqjgCBrVhvpO2"
        );
    });

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(
              `${API_URL}/api/blogs`
            );
            setBlogs(res.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    fetchBlogs();

    return () => unsubscribe();
}, []);


    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');


    const handleLike = async (blog_id) => {
        try {
            const response = await axios.patch(`${API_URL}/blogs/like/${blog_id}`);
            // After successfully updating the likes count in the backend, fetch the updated list of blogs
            if (response.status === 200) {
                axios.get(`${API_URL}/blogs`).then((res) => {
                    console.log(res.data)
                    setBlogs(res.data)
                }).catch(() => {
                    console.log("Error fetching data")
                })
            }
        } catch (error) {
            console.error('Error liking the blog post:', error);
        }
    };

  
const handleNewBlogSubmit = async (event) => {
  event.preventDefault();

  if (!newTitle.trim() || !newContent.trim()) {
    alert("Please enter both title and content.");
    return;
  }

  const today = new Date();

  const date = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const response = await axios.post(
      `${API_URL}/api/blogs`,
      {
        newTitle: newTitle.trim(),
        date,
        newContent: newContent.trim(),
        likes: 0,
      }
    );

    console.log("Blog added:", response.data);

    const blogsResponse = await axios.get(
      `${API_URL}/api/blogs`
    );

    setBlogs(blogsResponse.data);
    setNewTitle("");
    setNewContent("");

    alert("Blog added successfully!");
  } catch (error) {
    console.error(
      "Blog error:",
      error.response?.status,
      error.response?.data || error.message
    );

    alert(
      error.response?.data?.message ||
      `Unable to add blog. ${
        error.response?.status
          ? `Status: ${error.response.status}`
          : error.message
      }`
    );
  }
};



     
    return (
        <div className="blog-section py-14">
            <h2 className="text-center text-5xl font-bold mb-14">Latest  <span className='text-orange-400'>Blogs</span> 📚</h2>

            {/* Blog creation form */}
            {admin?
            <div className="blog-creation-form mb-8" style={{ width: "80%", margin: "auto" }}>
                <form onSubmit={handleNewBlogSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Blog Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Blog Content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="p-2 border rounded"
                        rows="4"
                        required
                    />
                    <button type="submit" className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600">
                        Add Blog
                    </button>
                </form>
            </div>:""}

            <div className="blogs-container grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto px-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="blog-post mb-8 p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="blog-title font-semibold text-2xl text-gray-800 mb-3">{blog.newTitle}</h3>
                        <p className="blog-date text-gray-400 text-sm mb-4">{blog.date}</p>
                        <p className="blog-content text-gray-600 mb-4">{blog.newContent}</p>
                        <span className="text-blue-500 cursor-pointer" onClick={() => handleLike(blog._id)}>Like</span>
                        <span className="ml-2">{blog.likes} Likes</span>
                    </div>
                ))}
            </div>

            <Footer/>
        </div>
    );
}

export default Blogs