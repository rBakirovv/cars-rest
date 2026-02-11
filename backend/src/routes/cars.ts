import { Router, Response } from 'express';
import prisma from '../db/prisma.js';
import { PaginationQuery, ApiResponse } from '../types/index.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { Prisma } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as PaginationQuery;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ['id', 'brand', 'model', 'year', 'price', 'mileage', 'color', 'vin', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy!) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const where: Prisma.CarWhereInput = search
      ? {
          OR: [
            { brand: { contains: search, mode: 'insensitive' } },
            { model: { contains: search, mode: 'insensitive' } },
            { vin: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy: { [sortField!]: order },
        skip,
        take: limitNum,
      }),
      prisma.car.count({ where }),
    ]);

    const response: ApiResponse<typeof cars> = {
      success: true,
      data: cars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      res.status(404).json({ success: false, error: 'Автомобиль не найден' });
      return;
    }

    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { brand, model, year, price, mileage, color, vin } = req.body;

    if (!brand || !model || !year || !price || mileage === undefined || !color || !vin) {
      res.status(400).json({ success: false, error: 'Все поля обязательны' });
      return;
    }

    if (vin.length !== 17) {
      res.status(400).json({ success: false, error: 'VIN должен содержать ровно 17 символов' });
      return;
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      res.status(400).json({ success: false, error: `Год должен быть от 1900 до ${currentYear + 1}` });
      return;
    }

    if (price <= 0) {
      res.status(400).json({ success: false, error: 'Цена должна быть больше 0' });
      return;
    }

    if (mileage < 0) {
      res.status(400).json({ success: false, error: 'Пробег не может быть отрицательным' });
      return;
    }

    const existingCar = await prisma.car.findUnique({ where: { vin: vin.toUpperCase() } });
    if (existingCar) {
      res.status(400).json({ success: false, error: 'Автомобиль с таким VIN уже существует' });
      return;
    }

    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year,
        price,
        mileage,
        color,
        vin: vin.toUpperCase(),
      },
    });

    res.status(201).json({ success: true, data: car });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { brand, model, year, price, mileage, color, vin } = req.body;

    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar) {
      res.status(404).json({ success: false, error: 'Автомобиль не найден' });
      return;
    }

    if (!brand || !model || !year || !price || mileage === undefined || !color || !vin) {
      res.status(400).json({ success: false, error: 'Все поля обязательны' });
      return;
    }

    if (vin.length !== 17) {
      res.status(400).json({ success: false, error: 'VIN должен содержать ровно 17 символов' });
      return;
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      res.status(400).json({ success: false, error: `Год должен быть от 1900 до ${currentYear + 1}` });
      return;
    }

    if (price <= 0) {
      res.status(400).json({ success: false, error: 'Цена должна быть больше 0' });
      return;
    }

    if (mileage < 0) {
      res.status(400).json({ success: false, error: 'Пробег не может быть отрицательным' });
      return;
    }

    const duplicateVin = await prisma.car.findFirst({
      where: {
        vin: vin.toUpperCase(),
        NOT: { id },
      },
    });
    if (duplicateVin) {
      res.status(400).json({ success: false, error: 'Другой автомобиль с таким VIN уже существует' });
      return;
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        brand,
        model,
        year,
        price,
        mileage,
        color,
        vin: vin.toUpperCase(),
      },
    });

    res.json({ success: true, data: car });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      res.status(404).json({ success: false, error: 'Автомобиль не найден' });
      return;
    }

    await prisma.car.delete({ where: { id } });

    res.json({ success: true, data: { message: 'Автомобиль удалён' } });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
