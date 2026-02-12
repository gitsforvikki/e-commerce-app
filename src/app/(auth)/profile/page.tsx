import ProfileForm from "@/components/auth/ProfileForm";

export default function ProfilePage() {
  return (
    <>
      <div className="mt-24 mb-20 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-800 font-bold mb-6">
          Hi Vikki
        </h2>
        <ProfileForm />
      </div>
    </>
  );
}
