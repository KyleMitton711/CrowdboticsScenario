// User Main
import Login from "@/views/auth/Login";
import Register from "@/views/auth/Register";
import ResetPassword from "@/views/auth/ResetPassword";
import NewPassword from "@/views/auth/NewPassword";
import AppList from "@/views/apps/List";
import PlanList from "@/views/plans/List";
import SubscriptionList from "@/views/subscriptions/List";
import Profile from "@/views/auth/Profile";

// layout
import AuthLayout from "@/layouts/AuthLayout";
import FullLayout from "@/layouts/FullLayout";

export const routes = [
  {
    path: "/",
    redirect: '/auth',
    component: FullLayout,
    children: [
      {
        name: "AppList",
        path: "/apps",
        component: AppList,
      },
      {
        name: "PlanList",
        path: "/plans",
        component: PlanList,
      },
      {
        name: "SubscriptionList",
        path: "/subscriptions",
        component: SubscriptionList,
      },
      {
        name: "Profile",
        path: "/profile",
        component: Profile,
      }
    ]
  },
  {
    path: "/auth",
    redirect: "/auth/login",
    component: AuthLayout,
    children: [
      {
        name: "Login",
        path: "login",
        component: Login,
        meta: {
          publicRoute: true
        }
      },
      {
        name: "Register",
        path: "register",
        component: Register,
        meta: {
          publicRoute: true
        }
      },
      {
        name: "ResetPassword",
        path: "resetpassword",
        component: ResetPassword,
        meta: {
          publicRoute: true
        }
      },
      {
        name: "NewPassword",
        path: "newpassword",
        component: NewPassword,
        meta: {
          publicRoute: true
        }
      }
    ]
  }
];
