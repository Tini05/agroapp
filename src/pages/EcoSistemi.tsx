import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const EcoSistemi: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, "EcoSistemi"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-primary text-center animate__animated animate__zoomIn">
        Eco Sistemi 🌍
      </h1>
      <p className="text-muted text-center">
        Ruajtja e biodiversitetit dhe promovimi i një ekosistemi të qëndrueshëm.
      </p>

      <div className="row mt-4">
        {articles.map((article) => (
          <div key={article.id} className="col-lg-4 col-md-6 mb-4 animate__animated animate__fadeInUp">
            <div className="card shadow-lg border-primary">
              <img src={article.image} className="card-img-top rounded-top" alt={article.title} />
              <div className="card-body text-center">
                <h4 className="card-title text-primary">{article.title}</h4>
                <p className="card-text">{article.content.substring(0, 100)}...</p>
                <Link to={`/article/${"EcoSistemi"}/${article.id}`} className="btn btn-primary text-white">
                  Lexo më shumë
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EcoSistemi;
