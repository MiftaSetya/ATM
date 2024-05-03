import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState();

    useEffect(() => {
      try {
        fetch('http://localhost:3000/rekening') // Endpoint yang kamu buat di Express
            .then((res) => res.json(res))
            .then((result) => setData(result))
            .catch((err) => console.log(err));
        
        console.log("p");
        console.log(data);
        
      } catch (error) {
        console.log(error);
      }
        
    }, []);

    return (
        <div>
            <h1>Data dari Server:</h1>
            <p>{data}</p>
        </div>
    );
}
