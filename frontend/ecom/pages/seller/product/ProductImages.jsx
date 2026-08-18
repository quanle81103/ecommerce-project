export default function ProductImages({files, setFiles}) {
    const handleSelect = (e) => {
        const selected = Array.from(e.target.files);

        setFiles(selected);
    };

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Hình ảnh sản phẩm
            </h2>

            <input type="file" multiple accept="image/*" onChange={handleSelect}/>
        
            <div className="grid grid-cols-4 gap-4 mt-5">
                {
                    files.map((file,index) => (
                        <img src={URL.createObjectURL(file)} alt="" key={index} className="w-32 h-32 object-cover rounded-lg border"/>
                    ))
                }
            </div>
        </div>
    );
}