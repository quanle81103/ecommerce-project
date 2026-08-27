import { useEffect, useState } from "react";
import { getDistricts, getProvinces, getWards } from "../../services/ghnService";

export default function ShippingAddress({ address, setAddress, errors = {} }) {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState({ provinces: true, districts: false, wards: false });

    useEffect(() => {
        getProvinces().then(setProvinces).catch(() => setProvinces([])).finally(() => setLoading((value) => ({ ...value, provinces: false })));
    }, []);

    const update = (name, value) => setAddress((current) => ({ ...current, [name]: value }));
    const handleProvince = async (event) => {
        const provinceId = event.target.value;
        setAddress((current) => ({ ...current, provinceId, districtId: "", wardCode: "" }));
        setDistricts([]); setWards([]);
        if (!provinceId) return;
        setLoading((value) => ({ ...value, districts: true }));
        try { setDistricts(await getDistricts(provinceId)); } finally { setLoading((value) => ({ ...value, districts: false })); }
    };
    const handleDistrict = async (event) => {
        const districtId = event.target.value;
        setAddress((current) => ({ ...current, districtId, wardCode: "" }));
        setWards([]);
        if (!districtId) return;
        setLoading((value) => ({ ...value, wards: true }));
        try { setWards(await getWards(districtId)); } finally { setLoading((value) => ({ ...value, wards: false })); }
    };
    const fieldError = (name) => errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>;

    return (
        <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">Họ tên người nhận<input value={address.receiverName} onChange={(event) => update("receiverName", event.target.value)} autoComplete="name" className="field-control mt-2 font-normal" />{fieldError("receiverName")}</label>
                <label className="text-sm font-semibold">Số điện thoại<input value={address.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" className="field-control mt-2 font-normal" />{fieldError("phone")}</label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="text-sm font-semibold">Tỉnh / thành phố<select value={address.provinceId} onChange={handleProvince} disabled={loading.provinces} className="field-control mt-2 font-normal"><option value="">{loading.provinces ? "Đang tải..." : "Chọn tỉnh/thành phố"}</option>{provinces.map((province) => <option value={province.ProvinceID} key={province.ProvinceID}>{province.ProvinceName}</option>)}</select>{fieldError("provinceId")}</label>
                <label className="text-sm font-semibold">Quận / huyện<select value={address.districtId} onChange={handleDistrict} disabled={!address.provinceId || loading.districts} className="field-control mt-2 font-normal"><option value="">{loading.districts ? "Đang tải..." : "Chọn quận/huyện"}</option>{districts.map((district) => <option value={district.DistrictID} key={district.DistrictID}>{district.DistrictName}</option>)}</select>{fieldError("districtId")}</label>
                <label className="text-sm font-semibold">Phường / xã<select value={address.wardCode} onChange={(event) => update("wardCode", event.target.value)} disabled={!address.districtId || loading.wards} className="field-control mt-2 font-normal"><option value="">{loading.wards ? "Đang tải..." : "Chọn phường/xã"}</option>{wards.map((ward) => <option value={ward.WardCode} key={ward.WardCode}>{ward.WardName}</option>)}</select>{fieldError("wardCode")}</label>
            </div>
            <label className="mt-4 block text-sm font-semibold">Địa chỉ cụ thể<input value={address.street} onChange={(event) => update("street", event.target.value)} autoComplete="street-address" placeholder="Số nhà, tên đường..." className="field-control mt-2 font-normal" />{fieldError("street")}</label>
        </section>
    );
}
