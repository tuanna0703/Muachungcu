export const runtime = 'edge';
import ProjectDetail from './ProjectDetail';

export default function Page({ params }) {
  return <ProjectDetail params={params} />;
}
