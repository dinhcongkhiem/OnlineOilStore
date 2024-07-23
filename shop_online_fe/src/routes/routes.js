// Pages
import {
    Contact, Home, Introduce, Product, ProductDetail,
    UserInfo, ChangePassword, Cart,
    Payment, PaymentDetail, OrderManagement,
    ActiveAccountRedirect
} from '../page'

import DefaultLayout from '../layouts/DefaultLayout'
import DeliveryManagement from '../page/Admin/DeliveryManagement/DeliveryManagement';
// Public routes
const publicRoutes = [
    { path: "/", component: Home },
    { path: "/product", component: Product },
    { path: "/introduce", component: Introduce },
    { path: "/contact", component: Contact },
    { path: "/product-detail", component: ProductDetail },
    { path: "/verify/redirect", component: ActiveAccountRedirect },

];

const privateRoutes = [
    { path: "/profile/info", component: UserInfo },
    { path: "/profile/pass", component: ChangePassword },
    { path: "/cart", component: Cart, layout : DefaultLayout },
    { path: "/payment", component: Payment, layout : DefaultLayout },
    { path: "/payment-detail", component: PaymentDetail, layout : DefaultLayout },
];

const adminRoutes = [
    {path: "/admin/orders", component: OrderManagement},
    {path: "/admin/delivery", component: DeliveryManagement}

]

export { publicRoutes, privateRoutes, adminRoutes};
