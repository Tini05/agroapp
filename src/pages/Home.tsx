import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { Carousel } from "react-bootstrap"; // Bootstrap Carousel for slideshow
import "../Home.css";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const pageLinks = ['bio-produksioni', 'eco-sistemi', 'green-farming'];
  const articleLinks: any[] = [];

  // Fetch latest articles from Firestore
  const fetchLatestArticles = async () => {
    try {
      const collections = ["GreenFarming", "EkonomiaQarkulluese", "BioProduksioni", "EcoSistemi", "LajmeBujqesore", "Veterina", "Bletaria", "Bujqesia"];
      let allArticles: any[] = [];
      const seenTitles = new Set(); // To track unique article titles
  
      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), orderBy("date", "desc"), limit(1));
        const querySnapshot = await getDocs(q);
        
        const articles = querySnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id, 
            title: doc.data().title, 
            category: collectionName,
          }))
          .filter((article) => {
            if (seenTitles.has(article.title)) {
              return false; // Ignore duplicate titles
            } else {
              seenTitles.add(article.title);
              // articleLinks.push(articles.data().categories[0])
              return true; // Add only unique articles
            }
          });
  
        allArticles = [...allArticles, ...articles];
      }
  
      // Shuffle the final list of unique articles
      //allArticles = allArticles.sort(() => 0.5 - Math.random());
      setLatestArticles(allArticles);
    } catch (err) {
      console.error("Error fetching latest articles", err);
    }
  };  

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="hero-section text-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="overlay"></div>
        <div className="hero-content">
          <motion.h1
            className="display-3"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Welcome to AgroWebsite 🌱
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Your trusted source for agricultural news, sustainable farming, and eco-friendly innovations.
          </motion.p>
          <motion.a
            href="/"
            className="btn btn-light btn-lg mt-3"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Explore More
          </motion.a>
        </div>
      </motion.div>

      {/* Latest Articles Slideshow */}
      <motion.div
        className="container mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-center text-primary">Latest Articles</h2>
        <Carousel className="mt-4">
          {latestArticles.map((article, index) => (
            <Carousel.Item key={index}>
              <motion.div
                className="article-slide text-center p-4 rounded shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={article.image}
                  alt="Article"
                  className="img-fluid rounded"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <h4 className="mt-3">{article.title}</h4>
                <p className="text-muted">{article.content.substring(0, 120)}...</p>
                <Link to={`/article/${article.category}/${article.id}`} className="btn btn-warning">
                  Lexo më shumë
                </Link>
              </motion.div>
              <br></br>
            </Carousel.Item>
          ))}
        </Carousel>
      </motion.div>

      {/* Featured Categories */}
      <motion.div
        className="container mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-center text-success">Explore Topics</h2>
        <div className="row mt-4">
          {["Bio Produksioni", "Eco Sistemi", "Green Farming"].map((category, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <motion.div
                className="category-card p-4 text-center shadow-lg rounded"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <h5>{category}</h5>
                <Link to={`/${pageLinks[index]}`} className="btn btn-warning">
                  Mëso më shumë
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        className="text-center mt-5 p-5 cta-section text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2>Join the Green Revolution!</h2>
        <p>Subscribe to our newsletter for the latest farming innovations.</p>
        <motion.a
          href="/"
          className="btn btn-light btn-lg"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Subscribe Now
        </motion.a>
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-5 pt-3 pb-3 text-muted">
        © 2025 AgroWebsite. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
