import Login from '../Pages/Login'

import Results from '../Pages/Results';

export const PublicRoutes = [
    {
      'element': <Login />,
      'path': '/login'
    },
    {
      'element': <Results />,
      'path': '/results/:id'
    },
    // {
    //   'element': <VerifyOtp />,
    //   'path': `/verifyOtp`  
    // },
    // {
    //   'element': <ResetPassword />,
    //   'path': '/resetPassword'
    //},
  ]