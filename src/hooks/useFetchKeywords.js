import useFetchData from "./useFetchData";

const useFetchKeywords = () => {
  const { data, loading, error } = useFetchData("keywords");
  return { data, loading, error };
};

export default useFetchKeywords;
