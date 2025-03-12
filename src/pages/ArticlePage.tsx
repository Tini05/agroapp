import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const ArticlePage: React.FC = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id || !category) return;
      const docRef = doc(db, category, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticle(docSnap.data());
      }
    };
    fetchArticle();
  }, [id, category]);

  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]");
    setSaved(savedArticles.includes(id));
  }, [id]);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!category || !id) return;
      const articlesRef = collection(db, category);
      const q = query(
        articlesRef,
        where("date", "<", new Date().toISOString()), // Filter by date
        orderBy("date", "desc"), // Order by most recent
        limit(4) // Fetch more articles to exclude the current one
      );
      const querySnapshot = await getDocs(q);
      const allArticles = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,  // Adding the document ID to the article data
      }));

      // Log the fetched articles and the current article's ID for debugging
      console.log("All articles:", allArticles);
      console.log("Current article ID:", id);

      // Exclude the current article from the related articles
      const filteredArticles = allArticles.filter((article) => article.id !== id);

      // Log the filtered articles
      console.log("Filtered articles:", filteredArticles);

      setRelatedArticles(filteredArticles.slice(0, 3)); // Get only the top 3 related articles
    };

    fetchRelatedArticles();
  }, [category, id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Lexoni këtë artikull: ${article?.title}`;
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    let savedArticles = JSON.parse(localStorage.getItem("savedArticles") || "[]");
    if (saved) {
      savedArticles = savedArticles.filter((articleId: string) => articleId !== id);
    } else {
      savedArticles.push(id);
    }
    localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
    setSaved(!saved);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!article) return <div className="text-center mt-5">Duke u ngarkuar...</div>;

  return (
    <div className="container mt-5 animate__animated animate__fadeInUp">
      {/* Header with return button */}
      <div className="d-flex justify-content-between mb-4">
        <button className="btn btn-secondary" onClick={goBack}>
          🔙 Kthehu
        </button>
      </div>

      {/* Article Title */}
      <h1 className="text-dark text-center mb-4 animate__animated animate__zoomIn" style={{ fontSize: "3rem", fontWeight: "bold" }}>
        {article.title}
      </h1>

      {/* Image and Metadata */}
      <div className="text-center mb-4">
        <img 
          src={article.image} 
          alt={article.title} 
          className="img-fluid rounded shadow-lg mb-3" 
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
        <p className="text-muted">{new Date(article.date).toLocaleDateString()}</p>
      </div>

      {/* Article Content */}
      <div className="article-content lead" style={{ wordWrap: "break-word", lineHeight: "1.8", fontSize: "1.1rem", maxWidth: "800px", margin: "auto" }}>
        {article.content}
      </div>

      {/* Social Share and Save Buttons */}
      <div className="d-flex justify-content-center gap-4 mt-5">
        <button 
          className="btn btn-outline-primary px-4 py-2" 
          onClick={() => handleShare("facebook")}>
          <i className="fab fa-facebook"></i> Share on Facebook
        </button>
        <button 
          className="btn btn-outline-info px-4 py-2" 
          onClick={() => handleShare("twitter")}>
          <i className="fab fa-twitter"></i> Share on Twitter
        </button>
        <button 
          className="btn btn-outline-success px-4 py-2" 
          onClick={() => handleShare("whatsapp")}>
          <i className="fab fa-whatsapp"></i> Share on WhatsApp
        </button>
        <button 
          className="btn btn-outline-warning px-4 py-2" 
          onClick={handlePrint}>
          🖨️ Print
        </button>
        <button 
          className={`btn ${saved ? "btn-danger" : "btn-outline-danger"} px-4 py-2`} 
          onClick={handleSave}>
          {saved ? "❤️ Saved" : "💾 Save for Later"}
        </button>
      </div>

      {/* Related Articles Section */}
      <div className="mt-5">
        <h3 className="text-dark mb-4">Related Articles</h3>
        <div className="row">
          {relatedArticles.map((relatedArticle, index) => (
            <div key={index} className="col-md-4">
              <div className="card">
                <img 
                  src={relatedArticle.image} 
                  className="card-img-top" 
                  alt={relatedArticle.title} 
                  style={{ height: "200px", objectFit: "cover" }} 
                />
                <div className="card-body">
                  <h5 className="card-title">{relatedArticle.title}</h5>
                  <p className="card-text">{relatedArticle.content.slice(0, 100)}...</p>
                  <Link to={`/article/${category}/${relatedArticle.id}`} className="btn btn-success text-white">
                    Lexo më shumë
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ArticlePage;
