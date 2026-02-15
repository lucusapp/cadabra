import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home"
import Profile from "@/pages/Profile"
import Article from '@/pages/Article'
import Layout from "@/components/layout"





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

