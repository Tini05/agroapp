import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const EkonomiaQarkulluese: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, "EkonomiaQarkulluese"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-info text-center animate__animated animate__fadeInDown">
        Ekonomia Qarkulluese ♻️
      </h1>
      <p className="text-muted text-center">
        Mësoni rreth ekonomisë qarkulluese dhe qëndrueshmërisë.
      </p>

      <div className="row mt-4 justify-content-center">
        {articles.map((article) => (
          <div key={article.id} className="col-md-8 mb-4">
            <div className="card shadow-lg animate__animated animate__fadeInUp p-3 border-info">
              <img src={article.image} className="card-img-top rounded" alt={article.title} />
              <div className="card-body">
                <h4 className="card-title text-info">{article.title}</h4>
                <p className="card-text">{article.content.substring(0, 120)}...</p>
                <Link to={`/article/${"EkonomiaQarkulluese"}/${article.id}`} className="btn btn-info text-white">
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

export default EkonomiaQarkulluese;
