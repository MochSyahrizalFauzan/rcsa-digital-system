"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface RolePermission {
  role: string;
  hakAkses: string[];
  permissions: {
    create: boolean;
    read: boolean;
    view: boolean;
    update: boolean;
    approve: boolean;
    delete: boolean;
    provision: boolean;
  };
}

const roleData: RolePermission[] = [
  {
    role: "Pemimpin Grup Risiko Operasional",
    hakAkses: [
      "Melihat keseluruhan hasil data master dan RCSA assessment.",
      "Memberikan persetujuan data master RCSA dan RCSA assessment.",
    ],
    permissions: {
      create: false,
      read: true,
      view: true,
      update: false,
      approve: true,
      delete: false,
      provision: false,
    },
  },
  {
    role: "Staff Risiko Operasional",
    hakAkses: [
      "Melihat keseluruhan hasil data master dan RCSA assessment.",
      "Mengolah data master RCSA.",
    ],
    permissions: {
      create: true,
      read: true,
      view: true,
      update: true,
      approve: false,
      delete: false,
      provision: false,
    },
  },
  {
    role: "Project Manager",
    hakAkses: [
      "Melihat keseluruhan hasil data master dan RCSA assessment.",
      "Mengolah data User.",
      "Mengolah data master RCSA.",
    ],
    permissions: {
      create: true,
      read: true,
      view: true,
      update: true,
      approve: false,
      delete: false,
      provision: true, // ini yang jadi “kelola user”
    },
  },
  {
    role: "PIC Unit Kerja",
    hakAkses: [
      "Mengolah data assessment RCSA.",
      "Melihat Riwayat RCSA assessment",
    ],
    permissions: {
      create: true,
      read: true,
      view: true,
      update: true,
      approve: false,
      delete: false,
      provision: false,
    },
  },
];

const UserRolePermission: React.FC = () => {
  return (
    <Card className="p-4 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Role User Matrix
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center font-bold">No</TableHead>
                <TableHead className="font-bold">Pengguna</TableHead>
                <TableHead className="font-bold">Hak Akses</TableHead>
                <TableHead className="text-center font-bold">Create (C)</TableHead>
                <TableHead className="text-center font-bold">Read (R)</TableHead>
                <TableHead className="text-center font-bold">View (V)</TableHead>
                <TableHead className="text-center font-bold">
                  Update / Write (U)
                </TableHead>
                <TableHead className="text-center font-bold">Approve (A)</TableHead>
                <TableHead className="text-center font-bold">Delete (D)</TableHead>
                <TableHead className="text-center font-bold">
                  User Provisioning (UP)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {roleData.map((item, index) => {
                const isPM = item.role === "Project Manager";
                const isSupervisor = item.role === "Pemimpin Grup Risiko Operasional";

                return (
                  <TableRow
                    key={index}
                    className={
                      isPM
                        ? "bg-blue-50 font-semibold"
                        : isSupervisor
                        ? "bg-green-50 font-semibold"
                        : "bg-yellow-50"
                    }
                  >
                    <TableCell className="text-center">{index + 1}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {item.role}
                    </TableCell>

                    <TableCell className="min-w-[420px]">
                      <ol className="list-decimal pl-5 space-y-1">
                        {item.hakAkses.map((h, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            {h}
                          </li>
                        ))}
                      </ol>
                    </TableCell>

                    {Object.values(item.permissions).map((perm, i) => (
                      <TableCell key={i} className="text-center">
                        {perm ? (
                          <Check className="text-green-500 inline-block" size={18} />
                        ) : (
                          <X className="text-red-500 inline-block" size={18} />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRolePermission;
