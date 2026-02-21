import { useDispatch, useSelector } from "react-redux"
import IconCard from "../../components/designs/Cards/IconCard"
import Header from "../../components/designs/TopComponents/Header"
import { cardData } from "../../utils/Data/HomeData"
import { ImSpinner2 } from "react-icons/im"
import Table from "./Table"
import { useEffect } from "react"
import { getTablesData } from "../../apis/homeApis"
import PieChart from "./PieChart"
import AreaChart from "./AreaChart"

const Home = () => {
    const isLoadingTable = useSelector((state) => state.home.isLoading);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     const getData = async () => {
    //         await getTablesData(dispatch);
    //     }
    //     getData();
    // }, [dispatch]);

    // console.log(JSON.parse(localStorage.getItem('estate_admin')));

    return (
        <div className='my-2 flex-1 md:mr-2 md:p-6 pt-[60px] px-1 md:rounded-2xl bg-white border shadow overflow-y-auto'>
            <Header title={'Dashboard'} />
            <div className="my-4 flex flex-col gap-6">
                <div className="w-full flex items-center justify-center">
                    <div className="bg-black text-white rounded-full p-4">
                        <p className="font-bold text-2xl">Coming Soon...</p>
                    </div>
                </div>
                {/* card data section */}
                {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {
                        cardData.map((item, index) =>
                            <IconCard
                                key={index}
                                item={item}
                            />
                        )
                    }
                </div> */}
                {/* chart data section */}
                {/* <div className="w-full flex flex-col sm:flex-row md:flex-col xl:flex-row xl:gap-8 gap-4">
                    <div className="xl:w-2/3 md:w-full sm:w-2/3 w-full border rounded-lg border-gray-300 p-4">
                        <AreaChart />
                    </div>
                    <div className="flex-1 border rounded-lg p-4 border-gray-300">
                        <PieChart />
                    </div>
                </div> */}
                {/* table data section */}
                {/* <div className="w-full">
                    {
                        isLoadingTable ?
                            <div className="w-full h-40 flex justify-center items-center border bg-gray-100 rounded-lg">
                                <ImSpinner2 className="animate-spin" />
                            </div>
                            :
                            <Table />
                    }
                </div> */}
            </div>
        </div>
    )
}

export default Home
