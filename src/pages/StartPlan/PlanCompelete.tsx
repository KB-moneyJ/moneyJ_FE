import TripCard from './PlanCard/PlanCard';


export default function PlanCompelete() {
  return (
    <div>
      <TripCard
        destination="Tokyo, Japan"
        countryCode="JP"
        period="2025.10.05 - 2025.10.12"
        thumbnailUrl="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
        progressPercent={80}
        onClickDetail={() => console.log('도쿄 상세보기 클릭')}
      />
    </div>
  );
}

