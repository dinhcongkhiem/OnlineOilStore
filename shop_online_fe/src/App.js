import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminLayout, DefaultLayout, ProfileLayout } from './layouts';
import { adminRoutes, privateRoutes, publicRoutes } from './routes/routes';
import {AdminRoute, PrivateRoute} from './component/PrivateRoute';
function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={route.path || index}
                            path={route.path}
                            element={
                                <DefaultLayout>
                                    <Page />
                                </DefaultLayout>
                            }
                        />
                    );
                })}
                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = ProfileLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    }
                    return (
                        <Route
                            key={route.path || index}
                            path={route.path}

                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </PrivateRoute>} />
                    );
                })}

                {adminRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = AdminLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    }
                    return (
                        <Route
                            key={route.path || index}
                            path={route.path}

                            element={
                                <AdminRoute>
                                    <Layout>
                                        <Page />
                                    </Layout>
                                </AdminRoute>}
                        />
                    );
                })}

            </Routes>
        </Router>
    );
}

export default App;
