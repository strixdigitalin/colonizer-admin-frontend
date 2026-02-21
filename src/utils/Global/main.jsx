// export const API_URI = 'https://colonizer-backend.vercel.app';
export const API_URI = "http://localhost:8080";

export const updatedData = (data, page, pageSize) => {
  const newData = data?.map((d, index) => {
    return { ...d, index: page * pageSize + index + 1 };
  });

  return newData;
};

export const getUpdatedData = (data) => {
  const newData = data?.map((d, index) => {
    // console.log(new Date(d.updatedAt).toLocaleDateString());
    // return { ...d, index: index + 1 };
    return {
      ...d,
      index: index + 1,
      updatedAt: `${new Date(d.updatedAt).toLocaleDateString("en-US", { day: "2-digit" })}/${new Date(d.updatedAt).toLocaleDateString("en-US", { month: "2-digit" })}/${new Date(d.updatedAt).getFullYear()}`,
    };
  });

  return newData;
};

export const jwtToken =
  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcmlzbWF0aWNfc3BhbTI1MzMiLCJleHAiOjE3MTk2ODU3NzYsImlhdCI6MTY4ODE0OTc3Nn0.cA3Wk_1PLexia7brajS_8RfhNgAArgrdwB_m_oR4ztSIYQpnY2rDEMQLhQRq3ThCuQ3uuB-nRxTqusfSfTT75A";

export const headersAuth = {
  "Content-Type": "multipart/form-data",
  Authorization: localStorage.getItem("unbind"),
  // 'Authorization': `Bearer ${jwtToken}`
};

export const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${jwtToken}`,
};

export const trimHeading = (data) => {
  if (data.length > 25) {
    return data.substring(0, 25) + "...";
  }
  return data;
};

export const trimContent = (data) => {
  if (data.length > 60) {
    return data.substring(0, 60) + "...";
  }
  return data;
};

export const handleChange = (e, setData) => {
  const { name, value } = e.target;

  setData((prev) => {
    return { ...prev, [name]: value };
  });
};

export const checkDateType = (value) => {
  if (
    value?.includes("createdAt") ||
    value === "creationDate" ||
    value === "date"
  ) {
    return true;
  }
  return false;
};

export const checkImageType = (value) => {
  if (value === "imageUrl" || value === "paymentProof" || value === "image") {
    return true;
  }
  return false;
};

export const checkHTMLType = (value) => {
  if (
    value === "blockStatus" ||
    value == "blogcontent" ||
    value == "blogdescription" ||
    value == "salesAndMarketingDetails" ||
    value == "description" ||
    value == "content"
  ) {
    return true;
  }
  return false;
};

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
