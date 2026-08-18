export default function ProductShipping({form,handleChange}){
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Thông tin vận chuyển
            </h2>
            <div className="grid grid-cols-4 gap-5">
                <input
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="Khối lượng"
                    className="border rounded-lg p-3"
                />
                <input
                    name="length"
                    value={form.length}
                    onChange={handleChange}
                    placeholder="Dài"
                    className="border rounded-lg p-3"
                />
                <input
                    name="width"
                    value={form.width}
                    onChange={handleChange}
                    placeholder="Rộng"
                    className="border rounded-lg p-3"
                />
                <input
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="Cao"
                    className="border rounded-lg p-3"
                />
            </div>
        </div>
    );
}