import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const testCars = [
  { brand: "Toyota", model: "Camry", year: 2018, price: 1650000, mileage: 89000, color: "Black", vin: "JTNB11HK8J3001234" },
  { brand: "Toyota", model: "RAV4", year: 2020, price: 2450000, mileage: 42000, color: "White", vin: "JTM6RFXV5L5012345" },
  { brand: "Volkswagen", model: "Passat", year: 2017, price: 1380000, mileage: 112000, color: "Silver", vin: "WVWZZZ3CZJE012346" },
  { brand: "Volkswagen", model: "Tiguan", year: 2019, price: 1980000, mileage: 67000, color: "Grey", vin: "WVGZZZ5N2KW012347" },
  { brand: "BMW", model: "320i", year: 2016, price: 1750000, mileage: 123000, color: "Blue", vin: "WBA8A9C59GK012348" },
  { brand: "BMW", model: "X5", year: 2018, price: 3450000, mileage: 81000, color: "Black", vin: "WBAKS81030G012349" },
  { brand: "Mercedes-Benz", model: "C200", year: 2017, price: 1950000, mileage: 99000, color: "White", vin: "WDD2050421R012350" },
  { brand: "Mercedes-Benz", model: "GLE350", year: 2019, price: 4200000, mileage: 54000, color: "Grey", vin: "WDC1660571A012351" },
  { brand: "Audi", model: "A4", year: 2018, price: 1980000, mileage: 88000, color: "Black", vin: "WAUZZZF48JA012352" },
  { brand: "Audi", model: "Q5", year: 2020, price: 3250000, mileage: 36000, color: "White", vin: "WAUZZZFY9L2012353" },
  { brand: "Hyundai", model: "Solaris", year: 2021, price: 980000, mileage: 25000, color: "Red", vin: "KMHCT41BAMU012354" },
  { brand: "Hyundai", model: "Tucson", year: 2019, price: 1650000, mileage: 70000, color: "Brown", vin: "TMAJ3813KJJ012355" },
  { brand: "Kia", model: "Rio", year: 2020, price: 1050000, mileage: 33000, color: "Blue", vin: "KNADM412LMJ012356" },
  { brand: "Kia", model: "Sportage", year: 2018, price: 1550000, mileage: 89000, color: "Black", vin: "KNDPC3A22J7012357" },
  { brand: "Ford", model: "Focus", year: 2017, price: 870000, mileage: 120000, color: "White", vin: "WF05XXGCC5H012358" },
  { brand: "Ford", model: "Kuga", year: 2019, price: 1580000, mileage: 65000, color: "Orange", vin: "WFDMXXESWMK012359" },
  { brand: "Nissan", model: "Qashqai", year: 2018, price: 1450000, mileage: 78000, color: "Silver", vin: "SJNFAAJ11U0123600" },
  { brand: "Nissan", model: "X-Trail", year: 2020, price: 2150000, mileage: 43000, color: "Green", vin: "JN1TBNW30L0123601" },
  { brand: "Lexus", model: "RX350", year: 2019, price: 4300000, mileage: 52000, color: "Black", vin: "JTJBZMCA7K2012362" },
  { brand: "Skoda", model: "Octavia", year: 2017, price: 1250000, mileage: 115000, color: "Grey", vin: "TMBJG7NE3J0123603" },
  { brand: "Mazda", model: "CX-5", year: 2019, price: 1850000, mileage: 58000, color: "Red", vin: "JM3KFBCM5K0123604" },
  { brand: "Mazda", model: "6", year: 2018, price: 1420000, mileage: 72000, color: "Blue", vin: "JM1GJ1W65J1123605" },
  { brand: "Honda", model: "CR-V", year: 2020, price: 2280000, mileage: 38000, color: "White", vin: "SHSRT3H54L0123606" },
  { brand: "Honda", model: "Accord", year: 2019, price: 1920000, mileage: 61000, color: "Silver", vin: "1HGCV1F34KA123607" },
  { brand: "Subaru", model: "Forester", year: 2018, price: 1780000, mileage: 85000, color: "Green", vin: "JF2SJABC5JH123608" },
  { brand: "Subaru", model: "Outback", year: 2020, price: 2350000, mileage: 41000, color: "Grey", vin: "4S4BSANC8L3123609" },
  { brand: "Volvo", model: "XC60", year: 2019, price: 2950000, mileage: 55000, color: "Black", vin: "YV4A22PK8K1123610" },
  { brand: "Volvo", model: "S60", year: 2018, price: 1850000, mileage: 78000, color: "White", vin: "YV1A22MK9J1123611" },
  { brand: "Jeep", model: "Grand Cherokee", year: 2018, price: 2680000, mileage: 82000, color: "Black", vin: "1C4RJFBG5JC123612" },
  { brand: "Jeep", model: "Wrangler", year: 2020, price: 3150000, mileage: 35000, color: "Orange", vin: "1C4HJXDG7LW123613" },
];

async function main() {
  console.log('Seeding database...');

  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      { email: 'admin@example.com', password: hashedPassword, name: 'Admin User' },
      { email: 'test@example.com', password: hashedPassword, name: 'Test User' },
    ],
  });
  console.log('✓ Created test users');

  await prisma.car.createMany({
    data: testCars,
  });
  console.log(`✓ Created ${testCars.length} cars`);

  console.log('\n✅ Seed completed successfully!');
  console.log('\nTest users:');
  console.log('  Email: admin@example.com | Password: password123');
  console.log('  Email: test@example.com  | Password: password123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
