import { RegisterView } from '@/features/register/RegisterView';

export default function MyRecordPage() {
  return (
    <RegisterView
      role="technician"
      title="My tickets"
      description="What you hold, what lapses soon, and what you are missing."
      showSite={false}
      canEdit={false}
    />
  );
}
