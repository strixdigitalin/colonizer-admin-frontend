export const logoutUtil = () => {
  console.log("logout is calling");
    // Remove admin data
  localStorage.removeItem("colonizer_admin");
  localStorage.removeItem("colonizer_admin_token");

  // Remove subadmin data
  localStorage.removeItem("adc_aspirants_subadmin");
  localStorage.removeItem("adc_aspirants_subadmin_token");

  // Redirect to login screen
  window.location.href = "/login";
};
