import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      department, 
      role, 
      status, 
      sortBy = 'joiningDate', 
      sortOrder = 'desc' 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.EmployeeWhereInput = {
      isDeleted: false,
      OR: search ? [
        { name: { contains: String(search) } },
        { email: { contains: String(search) } }
      ] : undefined,
      department: department ? String(department) : undefined,
      role: role ? String(role) : undefined,
      status: status ? String(status) : undefined,
    };

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [String(sortBy)]: sortOrder === 'asc' ? 'asc' : 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          department: true,
          designation: true,
          salary: true,
          joiningDate: true,
          status: true,
          role: true,
          profileImage: true,
          reportingManagerId: true,
          createdAt: true,
        }
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      data: employees,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
        salary: true,
        joiningDate: true,
        status: true,
        role: true,
        profileImage: true,
        reportingManager: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role, ...rest } = req.body;
    
    // Check if email exists
    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    // Only SuperAdmin can assign SuperAdmin role
    let assignedRole = role || 'EMPLOYEE';
    if (assignedRole === 'SUPER_ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only Super Admins can create Super Admins' });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        email,
        password: hashedPassword,
        role: assignedRole,
        ...rest
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const targetId = req.params.id;
    const { role, salary, password, status, ...rest } = req.body;
    
    const currentUserRole = req.user?.role;
    const currentUserId = req.user?.id;

    // Permissions check
    if (currentUserRole === 'EMPLOYEE' && currentUserId !== targetId) {
      return res.status(403).json({ message: 'You can only edit your own profile' });
    }

    let updateData: any = { ...rest };

    if (currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'HR_MANAGER') {
      if (salary !== undefined) updateData.salary = salary;
      if (status !== undefined) updateData.status = status;
      if (role !== undefined) {
        if (role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
           return res.status(403).json({ message: 'Only Super Admins can assign Super Admin role' });
        }
        updateData.role = role;
      }
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.employee.update({
      where: { id: targetId },
      data: updateData,
      select: {
        id: true, name: true, email: true, department: true, role: true
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    // Only SuperAdmin can delete
    if (req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Only Super Admins can delete employees' });
    }

    await prisma.employee.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getReportees = async (req: Request, res: Response) => {
  try {
    const reportees = await prisma.employee.findMany({
      where: { reportingManagerId: req.params.id, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        designation: true,
        profileImage: true,
      }
    });
    res.json(reportees);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignManager = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    if (req.user?.role === 'EMPLOYEE') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (id === managerId) {
      return res.status(400).json({ message: 'Cannot assign self as manager' });
    }

    // Cycle detection logic
    if (managerId) {
      let currentManager = await prisma.employee.findUnique({ where: { id: managerId }, select: { reportingManagerId: true } });
      while (currentManager?.reportingManagerId) {
        if (currentManager.reportingManagerId === id) {
          return res.status(400).json({ message: 'Circular reporting detected' });
        }
        currentManager = await prisma.employee.findUnique({ where: { id: currentManager.reportingManagerId }, select: { reportingManagerId: true } });
      }
    }

    await prisma.employee.update({
      where: { id },
      data: { reportingManagerId: managerId || null }
    });

    res.json({ message: 'Manager assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
