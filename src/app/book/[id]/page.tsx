
import Booking from "../Booking";

interface BookingProp {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingPage({ params }: BookingProp) {

  const { id } = await params;
  
  return <Booking id={id} />;
}