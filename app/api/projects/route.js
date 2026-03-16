export const runtime = "edge";

export async function GET(request) {
  try {
    // Kiểm tra env variables trước
    const envCheck = {
      has_sheet_id: !!process.env.GOOGLE_SHEET_ID,
      has_email: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      has_key: !!process.env.GOOGLE_PRIVATE_KEY,
      has_anthropic: !!process.env.ANTHROPIC_API_KEY,
    };

    // Nếu thiếu env → trả về mock data luôn
    if (!process.env.GOOGLE_SHEET_ID) {
      return Response.json({
        success: true,
        source: "mock",
        env_check: envCheck,
        data: [
          { id:"vh-001", ten_du_an:"Vinhomes Ocean Park 3", chu_dau_tu:"Vinhomes", tinh:"Hưng Yên", loai_hinh:"Đại đô thị", trang_thai:"Đang mở bán", gia_tu:2.1, gia_den:8.5, don_vi:"tỷ" },
          { id:"mi-002", ten_du_an:"Masteri Waterfront", chu_dau_tu:"Masterise Homes", tinh:"Hà Nội", loai_hinh:"Căn hộ cao cấp", trang_thai:"Sắp mở bán", gia_tu:4.2, gia_den:12, don_vi:"tỷ" },
          { id:"ak-003", ten_du_an:"Akari City", chu_dau_tu:"Nam Long Group", tinh:"TP. Hồ Chí Minh", loai_hinh:"Căn hộ tầm trung", trang_thai:"Đang bàn giao", gia_tu:2.8, gia_den:5.2, don_vi:"tỷ" },
          { id:"sw-004", ten_du_an:"Sun Grand City Feria", chu_dau_tu:"Sun Group", tinh:"Quảng Ninh", loai_hinh:"Shophouse & Căn hộ", trang_thai:"Đang mở bán", gia_tu:3.5, gia_den:25, don_vi:"tỷ" },
        ],
        meta: { total: 4, page: 1, limit: 10, totalPages: 1 }
      });
    }

    // Nếu có env → gọi Google Sheets
    const { getDuAn, getAllGiaCa } = await import("@/lib/sheets");
    const { withCache } = await import("@/lib/cache");

    const { searchParams } = new URL(request.url);
    const tinh       = searchParams.get("tinh") || "";
    const loai_hinh  = searchParams.get("loai_hinh") || "";
    const trang_thai = searchParams.get("trang_thai") || "";
    const search     = searchParams.get("search") || "";
    const page       = parseInt(searchParams.get("page") || "1");
    const limit      = parseInt(searchParams.get("limit") || "10");

    const [duAnList, giaCaList] = await Promise.all([
      withCache("du_an_all", () => getDuAn(), 300),
      withCache("gia_ca_all", () => getAllGiaCa(), 300),
    ]);

    const withPrices = duAnList.map(p => {
      const prices = giaCaList.filter(g => g.du_an_id === p.id);
      return { ...p, gia_tu: prices.length ? Math.min(...prices.map(g=>parseFloat(g.gia_tu)||0)) : null, gia_den: prices.length ? Math.max(...prices.map(g=>parseFloat(g.gia_den)||0)) : null, don_vi: prices[0]?.don_vi || "tỷ" };
    });

    let filtered = withPrices;
    if (tinh)       filtered = filtered.filter(p => p.tinh?.toLowerCase().includes(tinh.toLowerCase()));
    if (loai_hinh)  filtered = filtered.filter(p => p.loai_hinh?.toLowerCase().includes(loai_hinh.toLowerCase()));
    if (trang_thai) filtered = filtered.filter(p => p.trang_thai?.toLowerCase().includes(trang_thai.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.ten_du_an?.toLowerCase().includes(q) || p.chu_dau_tu?.toLowerCase().includes(q));
    }

    const total = filtered.length;
    const paginated = filtered.slice((page-1)*limit, page*limit);

    return Response.json({
      success: true,
      source: "sheets",
      data: paginated,
      meta: { total, page, limit, totalPages: Math.ceil(total/limit) }
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0,5).join(' | ')
    }, { status: 500 });
  }
}