"use client";

import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import AddUserDialog from "@/components/admin/setting/Users/AddUserDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";




function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function UserTable({ users }: { users: User[] }) {
  const [openAdd, setOpenAdd] = useState(false);
  const { toast } = useToast();
  const { fetchWithAuth } = useAuth();
  
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);



  const handleCopyUserId = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      toast({
        title: "Disalin",
        description: `User ID ${userId} disalin ke clipboard.`,
      });
    } catch {
      toast({
        title: "Gagal menyalin",
        description: "Browser menolak akses clipboard.",
        variant: "destructive",
      });
    }
  };


  const handleDetailUser = (user: User) => {
  setSelectedUser(user);
  setDetailOpen(true);
};

const handleToggleStatus = async (user: User) => {
  const nextStatus = user.status === "active" ? "inactive" : "active";

  try {
    const res = await fetchWithAuth(`/users/${user.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || "Gagal mengubah status user");
    }

    toast({
      title: "Berhasil",
      description: `${user.name} sekarang ${nextStatus}.`,
    });

    
    window.location.reload();
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Gagal",
      description: err?.message || "Tidak bisa update status user.",
      variant: "destructive",
    });
  }
};

const openConfirmToggle = (user: User) => {
  setPendingUser(user);
  setConfirmOpen(true);
};

const confirmToggle = async () => {
  if (!pendingUser) return;
  setConfirmOpen(false);
  await handleToggleStatus(pendingUser);
  setPendingUser(null);
};


  return (
    <Card className="p-6 w-full shadow-md">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Manajemen Pengguna</h2>
          <p className="text-sm text-gray-500">
            Melihat dan mengelola akun pengguna dan penetapan perannya
          </p>
        </div>
        <Button size="lg" onClick={() => setOpenAdd(true)}>
          + Add User
        </Button>
      </div>

      <AddUserDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          setOpenAdd(false);
          toast({
            title: "Berhasil",
            description: "User berhasil ditambahkan. Memuat ulang data...",
          });
          window.location.reload();
        }}
      />

      {users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Tidak ada data pengguna.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-base text-left">
            <thead className="text-gray-700 border-b">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Unit Kerja</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-medium text-lg">
                      {getInitials(user.name || user.email)}
                    </div>
                    <div>
                      <p className="font-medium text-base">{user.name}</p>
                      <p className="text-gray-500 text-sm">{user.user_id}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {user.role_name || "—"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600">{user.unit_name}</td>

                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 hover:bg-gray-200 rounded"
                          aria-label="Menu aksi"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleCopyUserId(user.user_id)}>
                            Copy User ID
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDetailUser(user)}>
                            Detail User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openConfirmToggle(user)}>
                            {user.status === "active" ? "Nonaktifkan User" : "Aktifkan User"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Detail User</DialogTitle>
              </DialogHeader>

              {!selectedUser ? (
                <div className="text-sm text-gray-500">Tidak ada data.</div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Nama:</span> {selectedUser.name}</div>
                  <div><span className="text-gray-500">User ID:</span> {selectedUser.user_id}</div>
                  <div><span className="text-gray-500">Email:</span> {selectedUser.email || "—"}</div>
                  <div><span className="text-gray-500">Role:</span> {selectedUser.role_name || "—"}</div>
                  <div><span className="text-gray-500">Unit:</span> {selectedUser.unit_name || "—"}</div>
                  <div><span className="text-gray-500">Status:</span> {selectedUser.status}</div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {pendingUser?.status === "active" ? "Nonaktifkan User?" : "Aktifkan User?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {pendingUser
                  ? `Anda akan ${pendingUser.status === "active" ? "menonaktifkan" : "mengaktifkan"} akun: ${pendingUser.name} (${pendingUser.user_id}).`
                  : "Tidak ada user dipilih."}
                <br />
                Aksi ini akan mempengaruhi akses login user tersebut.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setPendingUser(null);
                  setConfirmOpen(false);
                }}
              >
                Batal
              </AlertDialogCancel>

              <AlertDialogAction onClick={confirmToggle}>
                Ya, {pendingUser?.status === "active" ? "Nonaktifkan" : "Aktifkan"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        </div>
      )}
    </Card>
  );
}
