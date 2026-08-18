export default function ProductBasicInfo({
    form,
    handleChange
}) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">
                Thông tin cơ bản
            </h2>

            <div className="space-y-4">

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tên sản phẩm"
                    className="w-full border rounded-lg p-3"
                />

                <textarea
                    rows={5}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả sản phẩm"
                    className="w-full border rounded-lg p-3"
                />

            </div>

        </div>

    );

}