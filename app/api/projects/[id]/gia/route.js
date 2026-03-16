export const runtime = "edge";
import { getDuAnById, getGiaCa } from "@/lib/sheets";
import { withCache } from "@/lib/cache";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const [project, giaCa] = await Promise.all([
      withCache(`project_${id}`, () => getDuAnById(id), 300),
      withCache(`gia_${id}`, () => getGiaCa(id), 300),
    ]);
    if (!project) return Response.json({ success:false, error:"Không tìm thấy dự án" }, { status:404 });

    const giaTheoLoai = giaCa.reduce((acc,g) => {
      const loai = g.loai_can||"Khác";
      if (!acc[loai]) acc[loai]=[];
      acc[loai].push({ dien_tich_tu:parseFloat(g.dien_tich_tu)||null, dien_tich_den:parseFloat(g.dien_tich_den)||null, gia_tu:parseFloat(g.gia_tu)||null, gia_den:parseFloat(g.gia_den)||null, don_vi:g.don_vi||"tỷ" });
      return acc;
    }, {});

    const allPrices = giaCa.map(g=>parseFloat(g.gia_tu)).filter(Boolean);
    return Response.json({ success:true, data:{ du_an_id:id, ten_du_an:project.ten_du_an, tong_quan:{ gia_thap_nhat:allPrices.length?Math.min(...allPrices):null, gia_cao_nhat:allPrices.length?Math.max(...allPrices):null, don_vi:giaCa[0]?.don_vi||"tỷ", so_loai_can:Object.keys(giaTheoLoai).length }, gia_theo_loai:giaTheoLoai, bang_gia_day_du:giaCa } });
  } catch (error) {
    return Response.json({ success:false, error:error.message }, { status:500 });
  }
}
