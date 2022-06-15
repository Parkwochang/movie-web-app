import { useParams } from "react-router-dom";

export default function Movie() {
  const params = useParams();
  console.log(params);
  return <div>This is movie details</div>;
}
