import useFetchData from "./useFetchData";

const useFetchAuthors = () => {
  const { data, loading, error } = useFetchData("persons");
  return { data, loading, error };
};

export default useFetchAuthors;
