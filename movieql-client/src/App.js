import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movie from "./routes/Movie";
import Movies from "./routes/Movies";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="movies/*" element={<Movies />}>
          <Route path=":id" element={<Movie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
