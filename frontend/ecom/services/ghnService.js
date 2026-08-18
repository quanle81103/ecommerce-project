import addressApi from "../config/ghnConfig";

export const getProvinces = async() => {
    const { data } = await addressApi.get("/province");

    return data.data;
}

export const getDistricts = async(provinceId) => {
    const { data } = await addressApi.get("/district", {
        params: {
            province_id:provinceId
        }
    });

    return data.data;
}

export const getWards = async(districtId) => {
    const { data } = await addressApi.get("/ward", {
        params: {
            district_id: districtId
        }
    });

    return data.data;
}
