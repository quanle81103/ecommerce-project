export default function ProductPriceInventory({ form, handleChange }){
    return(
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Giá & Kho
            </h2>
            <div className="grid grid-cols-2 gap-6">
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Giá"
                    className="border rounded-lg p-3"
                />
                <input
                    type="number"
                    name="inventory"
                    value={form.inventory}
                    onChange={handleChange}
                    placeholder="Kho"
                    className="border rounded-lg p-3"
                />
            </div>
        </div>
    );
}