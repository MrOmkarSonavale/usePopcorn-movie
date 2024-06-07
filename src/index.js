import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';

// function Star({ maxRating }) {
//   return (
//     <div>
//       <StarRating maxRating={maxRating} />
//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />

    {/* <StarRating maxRating={5} color={'blue'} size={40}
      ratingMessage={['teribel', 'good', 'average', 'very good', 'exelant']}
    />
     {consumer props , reusable and flexible componet} 
    <Star maxRating={6} />
    */}

  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();