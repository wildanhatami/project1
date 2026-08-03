"use client";

import { useState } from "react";
import { Users, Shield, User, Mail, Calendar, CheckCircle2 } from "lucide-react";
import type { NotionUser } from "@/lib/notion-users";

interface UserManagementProps {
  initialUsers: NotionUser[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users] = useState<NotionUser[]>(initialUsers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-brand-brown">
            Pengguna Terdaftar ({users.length})
          </h3>
          <p className="text-xs text-brand-gray mt-0.5">
            Daftar akun pengguna yang melakukan login dengan Google OAuth
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-brown/8 p-12 text-center text-brand-gray space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-brand-light-cream flex items-center justify-center text-brand-brown/40">
            <Users size={22} />
          </div>
          <p className="font-medium text-brand-brown">Belum ada pengguna terdaftar</p>
          <p className="text-xs text-brand-gray">User yang login via Google akan otomatis tercatat di Notion Users Database.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-brown/8 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-brown">
              <thead className="bg-brand-light-cream/70 text-brand-gray uppercase font-semibold text-[10px] tracking-wider border-b border-brand-brown/8">
                <tr>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Peran (Role)</th>
                  <th className="px-6 py-4">Tanggal Bergabung</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-brown/8 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-brand-brown/[0.02] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name ? u.name[0].toUpperCase() : "U"}
                      </div>
                      <span className="font-semibold text-brand-brown text-sm truncate max-w-[180px]">
                        {u.name || "Pengguna Google"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-gray">
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} className="text-brand-gray/60" />
                        {u.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {u.role === "admin" && <Shield size={11} />}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-gray">
                      {u.createdAt ? (
                        new Date(u.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-green-200">
                        <CheckCircle2 size={11} /> Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
