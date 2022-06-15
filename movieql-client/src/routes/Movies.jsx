import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_MOvIES = gql`
  query allMovies {
    allMovies {
      title
      id
    }
    allTweets {
      id
      text
      author {
        fullName
      }
    }
  }
`;

export default function Movies() {
  const { data, loading, error } = useQuery(GET_MOvIES);
  console.log(loading);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) return <h1>Could not fetch </h1>;
  return (
    <>
      <ul>
        <h1>Movies</h1>
        {data.allMovies.map((movie) => (
          <li key={movie.id}>
            <Link to={`${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
        <h1>Tweets</h1>
        {data.allTweets.map((tweet) => (
          <li key={tweet.id}>
            <Link to={`${tweet.id}`}>
              {tweet.text} by: {tweet.author.fullName}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
