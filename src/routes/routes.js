
import Layout from "../components/layout/Layout";
import NotFoundPage from "../pages/NotFoundPage";
import Dashboard from "../pages/AccountPage/Dashboard";
import Products from "../pages/GoodPage/GoodsList";
import Orders from "../pages/Orders";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Areas from "../pages/AreaAndLocationPage/AreaPage/AreasList";
import Locations from "../pages/AreaAndLocationPage/LocationPage/LocationList";
import LoginPage from "../pages/AuthenticationPage/LoginPage/LoginPage";
import ForgotPasswordPage from "../pages/AuthenticationPage/ForgotPasswordPage";
import Accounts from "../pages/AccountPage/AccountList"
import CategoryList from "../pages/CategoryPage/CategoryList";
import BatchList from "../pages/BatchPage/BatchList";

export const routes = [
    {
        path: "/login",
        page: LoginPage,
    },
    {
        path: "/forgot-password",
        page: ForgotPasswordPage,
    },
    {
        path: "/",
        page: () => {
            if (localStorage.getItem("accessToken")) {
                window.location.href = "/admin/dashboard";
                return null;
            } else {
                window.location.href = "/login";
                return null;
            }
        },
    },
    {
        path: "/admin/dashboard",
        page: () => (
            <Layout>
                <Dashboard />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/products",
        page: () => (
            <Layout>
                <Products />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/orders",
        page: () => (
            <Layout>
                <Orders />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/reports",
        page: () => (
            <Layout>
                <Reports />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/settings",
        page: () => (
            <Layout>
                <Settings />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/areas",
        page: () => (
            <Layout>
                <Areas />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/locations",
        page: () => (
            <Layout>
                <Locations />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/batch",
        page: () => (
            <Layout>
                <BatchList />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/admin/accounts",
        page: () => (
            <Layout>
                <Accounts />
            </Layout>
        ),
        isShowHeader: true,
    },
    {
        path: "/sales-manager/categorys",
        page: () => (
            <Layout>
                <CategoryList />
            </Layout>
        ),
    },
    { path: "*", page: NotFoundPage },
];