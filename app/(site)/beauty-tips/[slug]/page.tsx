import { redirect } from "next/navigation";

type LegacyPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyBeautyTipPostPage({ params }: LegacyPostPageProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
