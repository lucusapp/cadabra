import { Routes, Route } from "react-router-dom";
import Layout from "./legacy/Layout";
import Home from "./legacy/Pages/Home";
import Profile from "./legacy/Pages/Profile";
import Article from '@/pages/Article'




export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/article/:id" element={<Article />} />   
      </Routes>
    </Layout>
  );
}

