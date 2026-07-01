
// src/Routes.jsx
import React from "react";
import { Route, Routes, Navigate,Outlet  } from "react-router-dom";

// Pages
import Home from "../pages/home";
import Decoration from "../pages/category/decorations/decorations";
import Gifting from '../pages/category/giftings/gifting';
import Artist from "../pages/category/artist/artist";
import Caterings from "../pages/category/caterings/caterings";
import Events from "../pages/category/events-management/events";
import BabyShower from "../pages/category/babyshower/babyshower";
import Services from "../pages/category/services-section/Services";

// Product Pages
import ProductDetailsPage from '../pages/products/product-details-page';
import DecorationsDetailsPage from "../pages/products/decorations-details-page";
import EventManagementDetailsPage from "../pages/products/event-management-details-page";
import GiftsDetailsPage from "../pages/products/gifts-details-page";
import CateringEventsDetailsPage from "../pages/products/catering-events-details-page";
import ArtistManagementDetailsPage from "../pages/products/artist-management-details-page";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Profile from "../pages/auth/Profile";
import ForgetPassword from "../components/authentication/ForgetPassword";

// Utility Pages
import CheckoutPage from "../pages/checkout/checkout";
import CustomizedCheckoutPage from "../pages/checkout/customizedCheckout";
import Cart from "../components/cart/cart";
import WishlistPage from "../pages/wishlist/Wishlist";
import HelpCentre from "../pages/help/HelpCentre";
import Order from "../pages/orders/order";
import ProfileOrderConfirmation from "../pages/orders/ProfileOrderConfirmation";
import ProfileCustomOrderConfirmation from "../pages/orders/ProfileCustomizedOrderConfirmation";
import ContactPage from "../pages/contact/Contact";
import AboutUs from "../pages/about-us/AboutUs";
// import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy";
import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy"
import TermsOfService from "../pages/terms-conditions/Terms";
import RefundPolicy from "../pages/refund/Refund";
import AuthMiddleware from "./AuthMiddleware";


const RoutesComponent = () =>{
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/decorations" element={<Decoration />} />
      <Route path="/decorations/:slug" element={<Decoration />} />
       <Route path="/artist-management" element={<Artist/>} />
          <Route path="/artist-management/:slug" element={<Artist/>} />
      <Route path="/giftings" element={<Gifting />} />
      <Route path="/giftings/:slug" element={<Gifting />} />
      <Route path="/artists" element={<Artist />} />
      <Route path="/catering" element={<Caterings />} />
      <Route path="/baby-shower" element={<BabyShower />} />
      <Route path="/event-management" element={<Events />} />
      <Route path="/event-management/:slug" element={<Events />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<Services />} />

      {/* Product Details */}
      <Route path="/decorations/service/:slug" element={<DecorationsDetailsPage />} />
      <Route path="/gifts/e-commerce/:slug" element={<GiftsDetailsPage />} />
        <Route path="/artist-management/service/:slug" element={<ArtistManagementDetailsPage />} />
      <Route path="/event-management/service/:slug" element={<EventManagementDetailsPage />} />
      <Route path="/artist/service/:slug" element={<ArtistManagementDetailsPage />} />
       <Route path="/event-catering" element={<Caterings></Caterings>} />
      <Route path="/event-catering/:slug" element={<Caterings></Caterings>} />
       
      <Route path="/event-catering/service/:slug" element={<CateringEventsDetailsPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forget-password" element={<ForgetPassword />} />

      {/* Utility Pages */}
      <Route path="/help" element={<HelpCentre />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/refunds" element={<RefundPolicy />} />

      {/* Protected Routes */}
      <Route element={<AuthMiddleware />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/:id" element={<CustomizedCheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order/:orderId" element={<Order />} />
        <Route path="/profile/:orderId" element={<ProfileOrderConfirmation />} />
        <Route path="/profile/custom/:orderId" element={<ProfileCustomOrderConfirmation />} />
      </Route>
    </Routes>
  );
};

export default RoutesComponent;
