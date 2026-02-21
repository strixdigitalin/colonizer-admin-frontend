import axios from "axios"
import { API_URI } from "../utils/Global/main";
import { addDayBoard, addHalfMonthBoard, addFullMonthBoard, loading, addPieChartData, addLineChartData } from "../store/homeSlice";

export const getTablesData = async (dispatch) => {
    dispatch(loading(true));
    try {
        const url1 = API_URI + `/api/leaderboard/daywise/1`;
        const url2 = API_URI + `/api/leaderboard/daywise/15`;
        const url3 = API_URI + `/api/leaderboard/daywise/30`;
        const url4 = API_URI + `/api/chart/withdrawlchart`;
        const url5 = API_URI + `/api/chart/epinchart`;
        const res1 = await axios.get(url1);
        const res2 = await axios.get(url2);
        const res3 = await axios.get(url3);
        const res4 = await axios.get(url4);
        const res5 = await axios.get(url5);

        dispatch(addDayBoard(res1?.data?.data));
        dispatch(addHalfMonthBoard(res2?.data?.data));
        dispatch(addFullMonthBoard(res3?.data?.data));
        dispatch(addPieChartData(res4?.data?.data));
        dispatch(addLineChartData(res5?.data?.data));
    } catch (err) {
        console.log(err);
    } finally {
        dispatch(loading(false));
    }
}