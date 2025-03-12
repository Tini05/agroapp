import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { db } from "../firebase"; // Firebase setup
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const Veterina: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, "Veterina"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-danger text-center animate__animated animate__fadeInDown">
        Veterina 🐄
      </h1>
      <p className="text-muted text-center">
        Artikuj mbi kujdesin dhe shëndetin e kafshëve.
      </p>

      <div className="row mt-4">
        {articles.map((article) => (
          <div key={article.id} className="col-md-12 mb-4">
            <div className="card shadow-lg animate__animated animate__fadeInLeft d-flex flex-row">
              <img src={article.image} className="card-img-left w-25" alt={article.title} />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content ? article.content.substring(0, 150) + "..." : "No description available."}
                </p>
                <Link to={`/article/${"Veterina"}/${article.id}`} className="btn btn-danger">
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

export default Veterina;
