import React, { useState } from 'react'
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const Usefetchpaper = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)

      useEffect(() => {
    // Don't fetch if there are no authorIds
    if (!authorIds || authorIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchPaper = async () => {
      console.log("Fetching Paper...");
      setLoading(true);
      setError(null);

      try {
        await Promise.all(
          missingAuthors.map(async (authorId) => {
            const docRef = doc(db, "persons", authorId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
              fetchedAuthors[authorId] = {
                id: docSnapshot.id,
                ...docSnapshot.data(),
              };
            } else {
              fetchedAuthors[authorId] = { name: "Unknown Author" };
            }
          })
        );
        setAuthors(fetchedAuthors);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);
    return (
    <div>Usefetchpaper</div>
    )
}

export default Usefetchpaper