export const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(Number(value) || 0);

export const getProductImage = (product) =>
    product?.image?.[0]?.imageUrl ||
    product?.image?.[0]?.imageUlr ||
    product?.productUrl ||
    "";

export const normalizeText = (value = "") =>
    value.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
