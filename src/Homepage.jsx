import React, { useEffect, useState } from "react";

export default function Homepage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/src/homepageData.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
}
