import axios from "axios"
import { API_URI } from "../utils/Global/main";
import { add, loading } from "../store/userSlice";

export const getUser = async (dispatch, userId) => {
    dispatch(loading(true));
    try {
        const url = API_URI + `/api/user/getuserprofile/${userId}`;
        const res = await axios.get(url);
        console.log(res);

        dispatch(add(res?.data?.data));
    } catch (err) {
        console.log(err);
    } finally {
        dispatch(loading(false));
    }
}