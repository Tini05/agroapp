import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { db } from "../firebase"; // Firebase setup
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const Bujqesia: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, "Bujqesia"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-success text-center animate__animated animate__fadeInDown">
        Bujqësia 🚜
      </h1>
      <p className="text-muted text-center">
        Artikuj mbi teknikat e avancuara të bujqësisë dhe zhvillimet e fundit.
      </p>

      <div className="row mt-4">
        {articles.map((article) => (
          <div key={article.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-lg animate__animated animate__zoomIn">
              <img src={article.image} className="card-img-top" alt={article.title} />
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">{article.content.substring(0, 100)}...</p>
                <Link to={`/article/${"Bujqesia"}/${article.id}`} className="btn btn-success">
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

export default Bujqesia;
