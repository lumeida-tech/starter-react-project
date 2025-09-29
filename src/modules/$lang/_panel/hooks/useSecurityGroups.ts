import { useState, useMemo } from "react";
export interface SecurityGroup {
  id: string;
  name: string;
  rulesCount: number;
  status: "allow" | "deny";
  createdAt: Date;
  description?: string;
  portee?: "Partagée" | "Privée";
}

export interface SecurityGroupAction {
  type: "edit" | "delete";
  groupId: string;
}
// Mock data
const mockSecurityGroups: SecurityGroup[] = [
  {
    id: "1",
    name: "Web Server Access",
    rulesCount: 5,
    status: "allow",
    portee: "Partagée",
    createdAt: new Date("2024-01-15T10:30:00"),
    description: "Règles d'accès pour les serveurs web",
  },
  {
    id: "2",
    name: "Database Security",
    rulesCount: 3,
    status: "deny",
    portee: "Partagée",
    createdAt: new Date("2024-01-20T14:15:00"),
    description: "Sécurisation des accès à la base de données",
  },
  {
    id: "3",
    name: "SSH Management",
    rulesCount: 2,
    status: "allow",
    portee: "Partagée",
    createdAt: new Date("2024-01-22T09:45:00"),
    description: "Gestion des connexions SSH administrateur",
  },
  {
    id: "4",
    name: "API Gateway",
    rulesCount: 8,
    status: "allow",
    portee: "Privée",
    createdAt: new Date("2024-01-25T16:20:00"),
    description: "Contrôle d'accès pour l'API Gateway",
  },
  {
    id: "5",
    name: "Email Server",
    rulesCount: 4,
    status: "deny",
    portee: "Privée",
    createdAt: new Date("2024-01-28T11:10:00"),
    description: "Sécurisation du serveur de messagerie",
  },
  {
    id: "6",
    name: "Load Balancer",
    rulesCount: 6,
    status: "allow",
    portee: "Privée",
    createdAt: new Date("2024-02-01T13:30:00"),
    description: "Configuration du répartiteur de charge",
  },
];

export const useSecurityGroups = () => {
  const [groups, setGroups] = useState<SecurityGroup[]>(mockSecurityGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "allow" | "deny">(
    "all"
  );

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);
      const matchesStatus =
        statusFilter === "all" || group.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [groups, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = groups.length;
    const allowed = groups.filter((g) => g.status === "allow").length;
    const denied = groups.filter((g) => g.status === "deny").length;
    const totalRules = groups.reduce((sum, g) => sum + g.rulesCount, 0);

    return { total, allowed, denied, totalRules };
  }, [groups]);

  const handleEdit = (id: string) => {
    // Implement edit logic
  };

  const handleDelete = (id: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setGroups((prev) => {
      const newGroups = prev.map((group) => {
        if (group.id === id) {
          const newStatus: "allow" | "deny" =
            group.status === "allow" ? "deny" : "allow";

          return { ...group, status: newStatus };
        }
        return group;
      });

      return newGroups;
    });
  };

  const handleAddNew = () => {
    // Implement add logic
  };

  return {
    groups,
    filteredGroups,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    handleAddNew,
  };
};
