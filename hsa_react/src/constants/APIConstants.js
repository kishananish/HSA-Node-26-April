/*
const host = "http://10.0.28.198";
const port = "3000";
export const BASE_URL =  `${host}:${port}/`;
export const BASE_API_URL =  `${host}:${port}/api/`;
*/
//const host = "https://hsa-api.herokuapp.com";
//const host = "http://157.175.59.217/v1";
// const host = "https://obscure-journey-86933.herokuapp.com";
const host = "localhost:3000";
// const host = "http://localhost:3001";
export const BASE_API_URL = `${host}/api/`;
//export const BASE_API_URL = 'http://localhost:3001/api/';

export const BASE_IMAGE_URL =
  "https://s3.us-east-1.amazonaws.com/hsa-bucket-kishan/";

export const ADMIN_LOGIN_API_URL = "admin/signin";
export const ADMIN_FORGOT_API_URL = "admin/forgot";
export const ADMIN_DASHBOARD_API_URL = "admin/dashboard";
export const ADMIN_PAYMENT = "payment/admin";
export const ADMIN_REPORT = "admin/report";

export const CATEGORY_API_URL = "categories";
export const CATEGORY_IMAGE_UPLOAD = "aws/uploadCategoryImage";
export const SUBCATEGORY_API_URL = "sub-categories";
export const FAQ_API_URL = "faq";
export const PROMOCODE_API_URL = "promo-code";
export const QUERY_API_URL = "contact-us";
export const ROLE_API_URL = "role";
export const NOTIFICATION_API_URL = "admin/notification";
export const SEARCH_USER_WITH_ROLE = "admin/search-users";
export const MATERIAL_API_URL = "material";

export const CUSTOMER_API_URL = "user/admin"; //'manageCustomer';
export const USER_LIST_API_URL = "user";
export const SERVICE_PROVIDER_API_URL = "manageUser";
export const SERVICE_PROVIDER_PROFILE_IMAGE_UPLOAD = "aws/uploadProfilePic";
export const SERVICE_REQUEST_API_URL = "service/admin";
export const CONFIG_API_URL = "configuration";
