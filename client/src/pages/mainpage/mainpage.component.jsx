import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import ErrorBoundary from '../../components/error-boundary/error-poundary.component';
import Spinner from '../../components/spinner/spinner.component';

import useStateValue from '../../consumer/state.consumer';

const Products = lazy(() =>
  import('../../components/products/products.component')
);
const SignIn = lazy(() => import('../../components/sign-in/sign-in.component'));
const SignUp = lazy(() => import('../../components/sign-up/sign-up.component'));
const Cart = lazy(() => import('../../components/cart/cart.component'));
const OrdersHistory = lazy(() =>
  import('../../components/orders-history/orders-history.component')
);
const ProductDetails = lazy(() =>
  import('../../components/product-details/product-details.component')
);
const OrdersDetails = lazy(() =>
  import('../../components/orders-details/orders-details.component')
);
const AddCategories = lazy(() =>
  import('../../components/add-categories/add-categories.component')
);
const AddProducts = lazy(() =>
  import('../../components/add-products/add-products.component')
);

const MainPage = () => {
  const { usersAPI } = useStateValue();
  const [isLoggedIn] = usersAPI.isLoggedIn;
  const [isAdmin] = usersAPI.isAdmin;

  return (
    <Switch>
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Route exact path='/details/:id' component={ProductDetails} />

          <Route exact path='/signin' component={!isLoggedIn && SignIn} />
          <Route exact path='/register' component={!isLoggedIn && SignUp} />

          <Route exact path='/category' component={isAdmin && AddCategories} />
          <Route exact path='/add_product' component={isAdmin && AddProducts} />
          <Route
            exact
            path='/edit_product/:id'
            component={isAdmin && AddProducts}
          />

          <Route
            exact
            path='/history'
            component={isLoggedIn && OrdersHistory}
          />
          <Route
            exact
            path='/history/:id'
            component={isLoggedIn && OrdersDetails}
          />

          <Route exact path='/cart' component={Cart} />

          <Route exact path='/' component={Products} />
        </Suspense>
      </ErrorBoundary>
    </Switch>
  );
};

export default MainPage;
