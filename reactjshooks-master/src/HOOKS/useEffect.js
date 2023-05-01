import React, { useEffect, useState } from "react";

import axios from "axios";


export default function Hello() {

  const [list, setList] = useState([]);


  useEffect(() => {

    axios.get("https://jsonplaceholder.typicode.com/posts").then((todo) => setList(todo.data));

  }, []);

  return (<div>{list.map((property) => (

    <div key={property.id}>

      {property.title}

    </div>

  ))}</div>);

}