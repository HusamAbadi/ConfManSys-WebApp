import { useEffect, useState, useCallback } from "react";
import { db } from "../firebase/config"; // Adjust the import as necessary
import { collection, getDocs } from "firebase/firestore";

const useFetchData = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Ensure collectionName is valid to prevent unnecessary fetch attempts
    if (!collectionName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(dataArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err); // Log error for debugging
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, refreshTrigger]); // Only rerun if collectionName or refreshTrigger changes

  return { data, loading, error, refresh };
};

export default useFetchData;
