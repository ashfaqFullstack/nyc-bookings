import PropertyDetailClient from "./property-detail-client";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {

  const { id } = await params;
  
  return <PropertyDetailClient id={id} />;
}