import ClientsDashboard from '../Pages/clients/'

import Results from '../Pages/Results';

export const PrivateRoutes = [
  {
    'element': <ClientsDashboard />,
    'path': '/dashboard'
  },
    {
      'element': <Results />,
      'path': 'clients/:id/results'
    },
    // {
    //   'element': <ForgotPassword />,
    //   'path': '/Dashboard'
    // },
    // {
    //   'element': <VerifyOtp />,
    //   'path': `/verifyOtp`  
    // },
    // {
    //   'element': <ResetPassword />,
    //   'path': '/resetPassword'
    //},
  ]