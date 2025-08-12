import Navbar from "../../components/Navbar/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>Welcome to your Dashboard</h1>
        <p>This is your protected area. Enjoy your stay!</p>
      </div>
    </>
  );
};

export default Dashboard;
