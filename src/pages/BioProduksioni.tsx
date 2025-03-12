import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const BioProduksioni: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const q = query(collection(db, "BioProduksioni"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArticles(articlesData);
    };
    fetchArticles();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-success text-center animate__animated animate__fadeInDown">
        Bio Produksioni 🌾
      </h1>
      <p className="text-muted text-center">
        Metodat e prodhimit organik dhe bujqësia miqësore me mjedisin.
      </p>

      <div className="row mt-4">
        {articles.map((article, index) => (
          <div key={article.id} className={`col-md-6 mb-4 ${index % 2 === 0 ? 'animate__animated animate__fadeInLeft' : 'animate__animated animate__fadeInRight'}`}>
            <div className="card shadow-lg border-success">
              <img src={article.image} className="card-img-top rounded-top" alt={article.title} />
              <div className="card-body">
                <h4 className="card-title text-success">{article.title}</h4>
                <p className="card-text">{article.content.substring(0, 120)}...</p>
                <Link to={`/article/${"BioProduksioni"}/${article.id}`} className="btn btn-success text-white">
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

export default BioProduksioni;
