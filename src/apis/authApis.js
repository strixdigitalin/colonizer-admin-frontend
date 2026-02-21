import axios from "axios"
import { API_URI } from "../utils/Global/main";
import { add, loading } from "../store/authSlice";

export const createMember = async (dispatch, data) => {
    try {
        dispatch(loading(true));
        const url = API_URI + `/api/auth/create`;
        const res = await axios.post(url, data);
        console.log(res);
        if (res?.status === 200)
            return {status: true, data: res.data.data};
        return false;
    } catch (err) {
        console.log(err);
    } finally {
        dispatch(loading(false));
    }
}

export const login = async (dispatch, data) => {
    try {
        dispatch(loading(true));

        const url = API_URI + '/api/v1/owner/login';
        const res = await axios.post(url, data);
        // console.log(res);

        if (res?.data?.statusCode === 200) {
            const res_data = { user: res?.data?.data?.owner, token: res?.data?.data?.tokens?.accessToken };
            localStorage.setItem('colonizer_admin', JSON.stringify(res_data));
            localStorage.setItem("colonizer_admin_token", res?.data?.data?.tokens?.accessToken);
            dispatch(add(res_data));
        }

        return res?.data?.statusCode;
    } catch (err) {
        console.log(err);
    } finally {
        dispatch(loading(false));
    }
}