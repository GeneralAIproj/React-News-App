"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define the Article interface
interface Article {
  source: { name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

const NewsComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 20;
  const router = useRouter();

  // Check for token and redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token
    } else {
      fetchNews(currentPage);
    }
  }, [currentPage, router]);

  // API URL from environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;


  // Fetch news articles
  const fetchNews = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}top-headlines`, {
        params: {
          country: 'us',
          apiKey: apiKey,
          pageSize: pageSize,
          page: page,
        },
      });
      setArticles(response.data.articles);
      setTotalResults(response.data.totalResults);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };


  const handleLogout = () =>  {
    localStorage.removeItem('token'); // Remove the JWT token

    router.push('/login'); // Redirect to login page
  };



  // Handle pagination
  const handleNextPage = () => {
    if (currentPage * pageSize < totalResults) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>

      <button className="logout-button"  onClick= {handleLogout}> Logout </button>


      <div className= "headlines-container">
            <h1> Top News Headlines</h1>
      </div>

      {loading && <p> Loading...</p>}

      {!loading && (
       <div className= "article-container">
       {articles.map((article, index) => (
         <article key={index}>
           <h2 className="article-header">{article.title}</h2>
           <p className="article-description">{article.description}</p>
           <a className="article-link"  href={article.url} target="_blank" rel= "noopener noreferrer">
             Read more
           </a>
         </article>
       ))}
     </div>
      )}

      {/* Pagination controls */}
      <div>
        <button onClick= {handlePrevPage} disabled={currentPage === 1}>
          Previous

        </button>

        <span>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled= {currentPage * pageSize >= totalResults}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsComponent;
