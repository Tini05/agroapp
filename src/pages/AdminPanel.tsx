import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Function to convert the image file to base64
const convertToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AdminPanel: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null); // Only handle one image
  const [imageBase64, setImageBase64] = useState<string>(""); // Base64 image string
  const [categories, setCategories] = useState<string[]>(["LajmeBujqesore"]);
  const [error, setError] = useState("");
  const [postedArticles, setPostedArticles] = useState<number>(0);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the number of articles posted by the current admin
    const fetchAdminStats = async () => {
      try {
        const q = query(collection(db, "articles"), where("author", "==", auth.currentUser?.email));
        const querySnapshot = await getDocs(q);
        setPostedArticles(querySnapshot.size);

        // Fetch the total number of articles posted
        const totalQuerySnapshot = await getDocs(collection(db, "articles"));
        setTotalArticles(totalQuerySnapshot.size);
      } catch (err) {
        console.error("Error fetching admin stats", err);
      }
    };

    fetchAdminStats();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64Image = await convertToBase64(file); // Convert to base64
      setImage(file); // Set the file for preview
      setImageBase64(base64Image); // Set the base64 image string
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (!title || !content || categories.length <= 0 || !imageBase64) {
        alert("Please fill all fields, select a category, and upload an image.");
        return;
      }

      for (const category of categories) {
        // Define the category collection dynamically
        const categoryCollection = collection(db, category);

        // Post the article to Firestore under the selected category collection
        await addDoc(categoryCollection, {
            title,
            content,
            categories,
            image: imageBase64, // Save base64 image string
            date: new Date().toISOString(),
            author: auth.currentUser?.email,
        });
      }

      let firstCategory = categories[0];
      await addDoc(collection(db, 'articles'), {
        title,
        content,
        firstCategory,
        image: imageBase64, // Save base64 image string
        date: new Date().toISOString(),
        author: auth.currentUser?.email,
    });

      alert("Article posted successfully!");
      // navigate("/");
    } catch (err) {
      setError("Failed to post article. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Post a New Article</h2>
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="mb-4 text-center">
        <p><strong>Your Stats:</strong></p>
        <p>Articles Posted: {postedArticles}</p>
        <p>Total Articles Posted: {totalArticles}</p>
      </div>

      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        {/* Display image preview */}
        {image && (
          <div className="mb-3">
            <h5>Image Preview:</h5>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="img-thumbnail"
              style={{ width: "100px", marginRight: "10px" }}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Categories</label>
          <select
            multiple
            className="form-control"
            value={categories}
            onChange={(e) => setCategories(Array.from(e.target.selectedOptions, option => option.value))}
          >
            <option value="LajmeBujqesore">Lajme Bujqesore</option>
            <option value="Bujqesia">Bujqesia</option>
            <option value="Veterina">Veterina</option>
            <option value="Bletaria">Bletaria</option>
            <option value="EkonomiaQarkulluese">Ekonomia Qarkulluese</option>
            <option value="BioProduksioni">Bio Produksioni</option>
            <option value="EcoSistemi">Eco Sistemi</option>
            <option value="GreenFarming">Green Farming</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Post Article</button>
      </form>
    </div>
  );
};

export default AdminPanel;
