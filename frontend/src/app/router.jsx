import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage.jsx";
import ItemsPage from "../pages/ItemsPage.jsx";
import ItemDetailsPage from "../pages/ItemDetailsPage.jsx";
import ItemFormPage from "../pages/ItemFormPage.jsx";
import DeleteItemPage from "../pages/DeleteItemPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/items/new" element={<ItemFormPage />} />
      <Route path="/items/:id/edit" element={<ItemFormPage mode="edit" />} />
      <Route path="/items/:id/delete" element={<DeleteItemPage />} />
      <Route path="/items/:id" element={<ItemDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
