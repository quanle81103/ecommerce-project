import CheckoutRow from "./CheckoutRow";

export default function CheckoutTable({ cartItems }) {
    return <section className="surface-card overflow-hidden"><h2 className="border-b px-5 py-4 text-xl font-bold">Sản phẩm</h2><div className="hidden grid-cols-12 gap-4 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 md:grid"><div className="col-span-6">Sản phẩm</div><div className="col-span-2 text-center">Đơn giá</div><div className="col-span-2 text-center">Số lượng</div><div className="col-span-2 text-right">Thành tiền</div></div><div className="divide-y">{cartItems.map((item) => <CheckoutRow key={item.id} item={item} />)}</div></section>;
}
