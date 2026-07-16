import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOrgTree = async (req: Request, res: Response) => {
  try {
    const allEmployees = await prisma.employee.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        designation: true,
        department: true,
        profileImage: true,
        reportingManagerId: true,
      }
    });

    const employeeMap = new Map();
    allEmployees.forEach(emp => {
      employeeMap.set(emp.id, { ...emp, children: [] });
    });

    const tree: any[] = [];

    allEmployees.forEach(emp => {
      if (emp.reportingManagerId) {
        const manager = employeeMap.get(emp.reportingManagerId);
        if (manager) {
          manager.children.push(employeeMap.get(emp.id));
        } else {
          // Manager might be deleted, add to root or handle appropriately
          tree.push(employeeMap.get(emp.id));
        }
      } else {
        tree.push(employeeMap.get(emp.id));
      }
    });

    res.json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
