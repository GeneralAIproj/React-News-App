
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';


// Define the Article interface
// Define the Article type based on the API response structure
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
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalResults, setTotalResults] = useState(0); // Total number of articles
  const [loading, setLoading] = useState(false); // Loading state
  const pageSize = 20; // Number of articles per page

  // API URL from environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Store the API key in .env

  
  console.log(apiUrl);
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
      setTotalResults(response.data.totalResults); // Total results returned by the API
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  // Fetch articles when the component mounts or when the page changes
  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

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
      <h1>Top News Headlines</h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          {articles.map((article, index) => (
            <div key={index}>
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage * pageSize >= totalResults}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsComponent;



// const NewsComponent = () => {
//   const [articles, setArticles] = useState<Article[]>([]);

//   // API URL from environment variables
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//   const apiKey = process.env.API_KEY

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}top-headlines`, {
//           params: {
//             country: 'us',
//             apiKey: apiKey, //from enviornment variable can change to a more secure backend solution later time permitting 
//           },
//         });
//         setArticles(response.data.articles);
//       } catch (error) {
//         console.error('Error fetching news:', error);
//       }
//     };

//     fetchNews();
//   }, [apiUrl]);

//   return (
//     <div>
//       <h1>Top News</h1>
//       {articles.map((article, index) => (
//         <div key={index}>
//           <h2>{article.title}</h2>
//           <p>{article.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NewsComponent;



