export const runtime = "edge";
import { getDuAnById, getGiaCa, getReviews } from "@/lib/sheets";
import { analyzeDuAn, analyzeSentiment } from "@/lib/claude";
import { withCache } from "@/lib/cache";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const with_ai = new URL(request.url).searchParams.get("with_ai") !== "false";

    const [project, giaCa, reviews] = await Promise.all([
      withCache(`project_${id}`, () => getDuAnById(id), 300),
      withCache(`gia_${id}`, () => getGiaCa(id), 300),
      withCache(`reviews_${id}`, () => getReviews(id), 300),
    ]);

    if (!project) return Response.json({ success:false, error:"Không tìm thấy dự án" }, { status:404 });

    const base = { ...project, gia_ca:giaCa, reviews, tong_reviews:reviews.length, rating_trung_binh: reviews.length ? (reviews.reduce((s,r)=>s+parseFloat(r.rating||0),0)/reviews.length).toFixed(1) : null };

    if (!with_ai) return Response.json({ success:true, data:base });

    const [aiAnalysis, aiSentiment] = await Promise.all([
      withCache(`analysis_${id}`, () => analyzeDuAn(project, giaCa, reviews), 3600),
      withCache(`sentiment_${id}`, () => analyzeSentiment(reviews), 3600),
    ]);

    return Response.json({ success:true, data:{ ...base, ai:{ analysis:aiAnalysis, sentiment:aiSentiment } } });
  } catch (error) {
    return Response.json({ success:false, error:error.message }, { status:500 });
  }
}
