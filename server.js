import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

const BASE_URL = "https://api.themoviedb.org/3/movie";
const BASE_KEY = `f0151314ce456acfa81500b904b2e0e7`;

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one!",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "mask",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    is the sum of fistName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object repersents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    # GET/api/v1/tweet/:id 와 동일
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

//  Get /api/v1/tweets
//  Post DELETE PUT /api/v1/tweets
//  GET /api/v1/tweet/:id

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id); // array.find() 일치하는 첫번째 배열을 찾아낸다 즉 id:2가 두개면 그중 첫번째 반환한다
    },
    allUsers() {
      console.log("allUsers called");
      return users;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((t) => t.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((t) => t.id !== id); // 일치하지 않는 것들로 새로운 배열을 만들어서 삭제하는 것처럼 기능을 만든다
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      // root는 User의 정보를 가지고 있는 객체이다 한번에 안하고 순서대로 불러온다
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((u) => u.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
