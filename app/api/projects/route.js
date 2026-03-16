export const runtime = "edge";

const MOCK_DATA = [
  { id:"vh-001", ten_du_an:"Vinhomes Ocean Park 3", chu_dau_tu:"Vinhomes", dia_chi:"Hưng Yên", tinh:"Hưng Yên", loai_hinh:"Đại đô thị", trang_thai:"Đang mở bán", gia_tu:2.1, gia_den:8.5, don_vi:"tỷ", dien_tich_tu:45, dien_tich_den:200, phap_ly:"Sổ hồng", ban_giao:"Q4 2025", tien_ich:"Bể bơi nước mặn, trường học, bệnh viện, TTTM, công viên 5ha" },
  { id:"mi-002", ten_du_an:"Masteri Waterfront", chu_dau_tu:"Masterise Homes", dia_chi:"Long Biên, Hà Nội", tinh:"Hà Nội", loai_hinh:"Căn hộ cao cấp", trang_thai:"Sắp mở bán", gia_tu:4.2, gia_den:12, don_vi:"tỷ", dien_tich_tu:52, dien_tich_den:150, phap_ly:"Sổ hồng lâu dài", ban_giao:"Q2 2026", tien_ich:"Sky gym, rooftop pool, concierge 24/7, view sông Hồng" },
  { id:"ak-003", ten_du_an:"Akari City", chu_dau_tu:"Nam Long Group", dia_chi:"Bình Tân, TP.HCM", tinh:"TP. Hồ Chí Minh", loai_hinh:"Căn hộ tầm trung", trang_thai:"Đang bàn giao", gia_tu:2.8, gia_den:5.2, don_vi:"tỷ", dien_tich_tu:58, dien_tich_den:90, phap_ly:"Sổ hồng", ban_giao:"Q1 2025", tien_ich:"Hồ bơi, công viên nội khu, trường học, khu thương mại" },
  { id:"sw-004", ten_du_an:"Sun Grand City Feria", chu_dau_tu:"Sun Group", dia_chi:"Hạ Long, Quảng Ninh", tinh:"Quảng Ninh", loai_hinh:"Shophouse & Căn hộ", trang_thai:"Đang mở bán", gia_tu:3.5, gia_den:25, don_vi:"tỷ", dien_tich_tu:40, dien_tich_den:300, phap_ly:"Sổ hồng 50 năm", ban_giao:"Q3 2026", tien_ich:"View vịnh Hạ Long, marina, casino, resort 5 sao" },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tinh       = searchParams.get("tinh") || "";
    const loai_hinh  = searchParams.get("loai_hinh") || "";
    const trang_thai = searchParams.get("trang_thai") || "";
    const search     = searchParams.get("search") || "";
    const page       = parseInt(searchParams.get("page") || "1");
    const limit      = parseInt(searchParams.get("limit") || "10");

    let filtered = MOCK_DATA;
    if (tinh)       filtered = filtered.filter(p => p.tinh?.toLowerCase().includes(tinh.toLowerCase()));
    if (loai_hinh)  filtered = filtered.filter(p => p.loai_hinh?.toLowerCase().includes(loai_hinh.toLowerCase()));
    if (trang_thai) filtered = filtered.filter(p => p.trang_thai?.toLowerCase().includes(trang_thai.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.ten_du_an?.toLowerCase().includes(q) || p.chu_dau_tu?.toLowerCase().includes(q));
    }

    const total = filtered.length;
    const paginated = filtered.slice((page-1)*limit, page*limit);

    return Response.json({ success:true, data:paginated, meta:{ total, page, limit, totalPages:Math.ceil(total/limit) } });
  } catch (error) {
    return Response.json({ success:false, error:error.message }, { status:500 });
  }
}
