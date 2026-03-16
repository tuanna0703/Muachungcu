export const runtime = "edge";
import { getDuAn, getAllGiaCa } from "@/lib/sheets";
import { withCache } from "@/lib/cache";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q        = searchParams.get("q") || "";
    const tinh     = searchParams.get("tinh") || "";
    const gia_tu   = parseFloat(searchParams.get("gia_tu") || "0");
    const gia_den  = parseFloat(searchParams.get("gia_den") || "999");
    const sap_xep  = searchParams.get("sap_xep") || "ten";
    const limit    = parseInt(searchParams.get("limit") || "20");

    const [duAnList, giaCaList] = await Promise.all([
      withCache("du_an_all", () => getDuAn(), 300),
      withCache("gia_ca_all", () => getAllGiaCa(), 300),
    ]);

    let results = duAnList.map(p => {
      const prices = giaCaList.filter(g=>g.du_an_id===p.id);
      return { ...p, gia_min: prices.length ? Math.min(...prices.map(g=>parseFloat(g.gia_tu)||999)) : null };
    });

    if (q) { const query=q.toLowerCase(); results=results.filter(p=>[p.ten_du_an,p.chu_dau_tu,p.dia_chi,p.tinh,p.loai_hinh].filter(Boolean).some(f=>f.toLowerCase().includes(query))); }
    if (tinh) results = results.filter(p=>p.tinh?.toLowerCase().includes(tinh.toLowerCase()));
    if (gia_tu>0||gia_den<999) results = results.filter(p=>!p.gia_min||(p.gia_min>=gia_tu&&p.gia_min<=gia_den));

    if (sap_xep==="gia_asc") results.sort((a,b)=>(a.gia_min||999)-(b.gia_min||999));
    else if (sap_xep==="gia_desc") results.sort((a,b)=>(b.gia_min||0)-(a.gia_min||0));
    else results.sort((a,b)=>a.ten_du_an.localeCompare(b.ten_du_an));

    return Response.json({ success:true, total:results.length, data:results.slice(0,limit) });
  } catch (error) {
    return Response.json({ success:false, error:error.message }, { status:500 });
  }
}
