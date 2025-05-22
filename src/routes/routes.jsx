// routes.jsx
import Overview from '../pages/Overview'
import Products from '../pages/products/Products'
import ProductForm from '../pages/products/ProductForm'
import Orders from '../pages/orders/Orders'
import OrderDetails from '../pages/orders/OrderDetails'
import Categories from '../pages/categories/Categories'
import CategoryForm from '../pages/categories/CategoryForm'
import Attributes from '../pages/attributes/Attributes'
import AttributeForm from '../pages/attributes/AttributeForm'
import ProductAttributes from '../pages/productAttributes/ProductAttributes'
import AttributesValue from '../pages/attributesvalue/AttributesValue'
import AttributeValueForm from '../pages/attributesvalue/AttributeValueForm'
import StaffAccounts from '../pages/staff/StaffAccounts'
import StaffForm from '../pages/staff/StaffForm'
import Coupon from '../pages/coupon/Coupon'
import CouponForm from '../pages/coupon/CouponForm'
import Country from '../pages/country/Country'
import CountryForm from '../pages/country/CountryForm'
import Account from '../pages/Account'
import Customers from "../pages/customers/Customers";
import CustomerForm from "../pages/customers/CustomerForm";
import ProductAttributesValue from "../pages/productAttributesValue/ProductAttributesValue.jsx";
import ProductGallery from "../pages/productGallery/ProductGallery.jsx";
import ProductGalleryForm from "../pages/productGallery/ProductGalleryForm.jsx";

export const protectedRoutes = [
    { path: '/', element: <Overview />, index: true },
    { path: 'products', element: <Products /> },
    { path: 'products/new', element: <ProductForm /> },
    { path: 'products/edit/:id', element: <ProductForm /> },

    { path: 'orders', element: <Orders /> },
    { path: 'orders/:id', element: <OrderDetails /> },

    { path: 'categories', element: <Categories /> },
    { path: 'categories/new', element: <CategoryForm /> },
    { path: 'categories/edit/:id', element: <CategoryForm /> },

    { path: 'product-gallery', element: <ProductGallery /> },
    { path: 'product-gallery/new', element: <ProductGalleryForm /> },
    { path: 'product-gallery/edit/:id', element: <ProductGalleryForm /> },

    { path: 'attributes', element: <Attributes /> },
    { path: 'attributes/new', element: <AttributeForm /> },
    { path: 'attributes/edit/:id', element: <AttributeForm /> },

    { path: 'attributes-value', element: <AttributesValue /> },
    { path: 'attributes-value/new', element: <AttributeValueForm /> },
    { path: 'attributes-value/edit/:id', element: <AttributeValueForm /> },

    { path: 'product-attributes', element: <ProductAttributes /> },
    { path: 'product-attributes-value', element: <ProductAttributesValue /> },

    { path: 'staff', element: <StaffAccounts /> },
    { path: 'staff/new', element: <StaffForm /> },
    { path: 'staff/:id', element: <StaffForm /> },

    { path: 'coupon', element: <Coupon /> },
    { path: 'coupon/new', element: <CouponForm /> },
    { path: 'coupon/edit/:id', element: <CouponForm /> },

    { path: 'country', element: <Country /> },
    { path: 'country/new', element: <CountryForm /> },
    { path: 'country/edit/:id', element: <CountryForm /> },

    { path: 'customer', element: <Customers /> },
    { path: 'customer/new', element: <CustomerForm /> },
    { path: 'customer/edit/:id', element: <CustomerForm /> },

    { path: 'account', element: <Account /> },
]
