import { useState, useEffect } from "react";
import { getWards, getDistricts, getProvinces } from "../../services/ghnService";

export default function ShippingAddress({ address, setAddress }) {

    const [provinces, setProvinces] = useState([]);

    const [districts, setDistricts] = useState([]);

    const [wards, setWards] = useState([]);

    const [form, setForm] = useState({
        // receiverName: "",
        // phone: "",
        provinceId: "",
        districtId: "",
        wardCode: "",
        // street: ""
    });

    useEffect(() => {
        loadProvinces();
    },[]);

    const loadProvinces = async() => {
        try {
            const res = await getProvinces();
            setProvinces(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleProvince = async(e) => {
        const provinceId = e.target.value;
        console.log("province change", e.target.value);
        setForm(prev => ({
            ...prev, provinceId, districtId : "", wardCode: ""
        }));
        const res = await getDistricts(provinceId);
        setDistricts(res);
        setWards([]);
    };


    const handleDistrict = async (e) => {
        const districtId = e.target.value;
        setForm(prev => ({
            ...prev,
            districtId,
            wardCode: ""
        }));
        const res = await getWards(districtId);
        setWards(res);
    };

    const handleWard = (e) => {
        const wardCode = e.target.value;
        setForm(prev => ({
            ...prev,
            wardCode
        }));

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        console.log("calling setAddress", form);
        setAddress(form);
    }, [form, setAddress]);

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Địa chỉ giao hàng
            </h2>

            {/* Receiver */}

            {/* Phone */}

            <div className="p-3 gap-0.5 border-2">
                {/* Province */}
                <select name="provinceId" id="" value={form.provinceId} 
                onChange={(e) => {
                    console.log("change", e.target.value);
                    handleProvince(e);
                }}>
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map(province => (
                        <option value={province.ProvinceID} key={province.ProvinceID} >
                            {province.ProvinceName}
                        </option>
                    ))}
                </select>
                {/* District */}
                <select name="districtId" id="" value={form.districtId} onChange={handleDistrict}>
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(district => (
                        <option value={district.DistrictID} key={district.DistrictID}>
                            {district.DistrictName}
                        </option>
                    ))}
                </select>
                {/* Ward */}
                <select name="wardCode" id="" value={form.wardCode} onChange={handleWard}>
                    <option value="">Chọn Phường</option>
                    {wards.map(ward => (
                        <option value={ward.WardCode} key={ward.WardCode}>
                            {ward.WardName}
                        </option>
                    ))}
                </select>
            </div>
            {/* Street */}
        </div>

    );
};