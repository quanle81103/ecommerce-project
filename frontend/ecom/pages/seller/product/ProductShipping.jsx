export default function ProductShipping({ form, handleChange, errors, mode }) {
    if (mode === "edit") return null;
    const fields = [["weight", "Khối lượng (gram)"], ["length", "Dài (cm)"], ["width", "Rộng (cm)"], ["height", "Cao (cm)"]];
    return <section className="surface-card p-5 sm:p-6"><h2 className="text-xl font-bold">Thông tin vận chuyển</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{fields.map(([name, label]) => <label key={name} className="text-sm font-semibold">{label}<input type="number" min="1" name={name} value={form[name]} onChange={handleChange} className="field-control mt-2 font-normal" />{errors[name] && <span className="mt-1 block font-normal text-red-600">{errors[name]}</span>}</label>)}</div></section>;
}
