import axios from "axios"
import { API_URI, headers, headersAuth } from "../utils/Global/main";
import { add, loading, update } from "../store/memberSlice";

export const getMembers = async (dispatch) => {
    dispatch(loading(true));

    const url = API_URI + `/api/user/getallusers`;
    const res = await axios.get(url);
    // console.log(res);

    dispatch(add(res?.data?.data));

    dispatch(loading(false));
}

export const updateMemberBlockStatus = async (dispatch, userId, data) => {
    dispatch(loading(true));

    const url = API_URI + `/api/auth/blockuser/${userId}`;
    const res = await axios.patch(url, data);
    // console.log(res);

    dispatch(update(res?.data?.data));

    dispatch(loading(false));
}