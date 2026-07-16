"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

const TreeNode = ({ node }: { node: any }) => {
  return (
    <div className="ml-6 relative">
      {/* Connector lines could be added here via CSS before/after pseudo elements for a true tree look */}
      <div className="flex items-center gap-3 py-3 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4">
        <div className="h-10 w-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
          {node.name.charAt(0)}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{node.name}</span>
          <span className="text-xs text-neutral-500">{node.designation || 'No Designation'}</span>
        </div>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="ml-4">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function OrganizationPage() {
  const [tree, setTree] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await api.get('/organization/tree');
        setTree(response.data);
      } catch (error) {
        console.error("Failed to fetch organization tree", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-6 w-6" />
          Organizational Hierarchy
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Structure</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading tree...</div>
          ) : tree.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">No employees found in the organization.</div>
          ) : (
            <div className="pt-4">
              {tree.map(rootNode => (
                <TreeNode key={rootNode.id} node={rootNode} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
