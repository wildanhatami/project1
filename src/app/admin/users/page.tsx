import UserManagement from "@/components/admin/UserManagement";
import { getAllUsers } from "@/lib/notion-users";

export const revalidate = 0; // Dynamic fetching

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-brand-brown">
          Pengguna Terdaftar
        </h2>
        <p className="text-sm text-brand-gray mt-1">
          Daftar seluruh akun pelanggan dan admin yang terintegrasi dengan Notion Users Database.
        </p>
      </div>
      <UserManagement initialUsers={users} />
    </div>
  );
}
