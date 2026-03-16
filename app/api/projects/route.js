export const runtime = "edge";
import { getDuAn, getAllGiaCa } from "@/lib/sheets";
import { withCache } from "@/lib/cache";

export async function GET(request) {
  try {
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
    if (search) { const q = search.toLowerCase(); filtered = filtered.filter(p => p.ten_du_an?.toLowerCase().includes(q) || p.chu_dau_tu?.toLowerCase().includes(q)); }

    const total = filtered.length;
    const paginated = filtered.slice((page-1)*limit, page*limit);

    return Response.json({ success:true, data:paginated, meta:{ total, page, limit, totalPages:Math.ceil(total/limit) } });
  } catch (error) {
    return Response.json({ success:false, error:error.message }, { status:500 });
  }
}
