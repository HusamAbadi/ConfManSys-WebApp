import React from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { FiUsers, FiFileText, FiCalendar, FiTag } from "react-icons/fi";
import { useState, useEffect } from "react";
import LineChart from "../components/Charts/LineChart";

const Dashboard = () => {
  const [stats, setStats] = useState({
    authors: 0,
    papers: 0,
    conferences: 0,
    keywords: 0,
    recentPapers: [],
    monthlySubmissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counts from different collections
        const collections = ["persons", "papers", "conferences", "keywords"];
        const counts = await Promise.all(
          collections.map(async (collectionName) => {
            const snapshot = await getDocs(collection(db, collectionName));
            return snapshot.size;
          })
        );

        // Fetch recent papers
        const papersQuery = query(
          collection(db, "papers"),
          // order by createdAt desc, limit to 5
          where("createdAt", "<=", new Date())
        );
        const papersSnapshot = await getDocs(papersQuery);
        const recentPapers = papersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate monthly submissions (simplified)
        const monthlyData = recentPapers.reduce((acc, paper) => {
          const month = new Date(paper.createdAt.toDate()).toLocaleString(
            "default",
            { month: "short" }
          );
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        setStats({
          authors: counts[0],
          papers: counts[1],
          conferences: counts[2],
          keywords: counts[3],
          recentPapers,
          monthlySubmissions: Object.entries(monthlyData).map(
            ([month, count]) => ({
              month,
              count,
            })
          ),
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            title="Total Authors"
            value={stats.authors}
          />
          <StatCard
            icon={FiFileText}
            title="Total Papers"
            value={stats.papers}
          />
          <StatCard
            icon={FiCalendar}
            title="Conferences"
            value={stats.conferences}
          />
          <StatCard icon={FiTag} title="Keywords" value={stats.keywords} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Monthly Submissions</h2>
            {/* Assume you have a LineChart component */}
            <LineChart data={stats.monthlySubmissions} />
          </div>

          {/* Recent Papers */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Papers</h2>
            <div className="space-y-4">
              {stats.recentPapers.slice(0, 5).map((paper) => (
                <div key={paper.id} className="border-b pb-2">
                  <h3 className="font-medium">{paper.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(paper.createdAt.toDate()).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
