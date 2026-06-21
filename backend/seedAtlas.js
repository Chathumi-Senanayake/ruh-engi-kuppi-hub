const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb+srv://admin:1234@cluster0.xqacsep.mongodb.net/kuppihub?appName=Cluster0';

const departmentsData = [
  { name: 'Electrical and Information Engineering', code: 'EE', description: 'Department of Electrical and Information Engineering' },
  { name: 'Civil and Environmental Engineering', code: 'CE', description: 'Department of Civil and Environmental Engineering' },
  { name: 'Mechanical and Manufacturing Engineering', code: 'ME', description: 'Department of Mechanical and Manufacturing Engineering' },
  { name: 'Interdisciplinary Studies', code: 'IS', description: 'Department of Interdisciplinary Studies' }
];

const modulesData = [
  { code: 'EE1301', name: 'Software Engineering', year: 1, semester: 3, deptCode: 'EE', description: 'Intro to SWE' },
  { code: 'EE1302', name: 'Computer Architecture', year: 1, semester: 3, deptCode: 'EE', description: 'Architecture basics' },
  { code: 'EE2201', name: 'Signals and Systems', year: 2, semester: 4, deptCode: 'EE', description: 'Signals basics' },
  { code: 'CE1301', name: 'Fluid Mechanics', year: 1, semester: 3, deptCode: 'CE', description: 'Fluids basics' },
  { code: 'ME1301', name: 'Thermodynamics', year: 1, semester: 3, deptCode: 'ME', description: 'Thermo basics' }
];

async function seedAtlas() {
  try {
    console.log('Connecting to Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Wipe collections
    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('departments').deleteMany({});
    await mongoose.connection.collection('modules').deleteMany({});
    await mongoose.connection.collection('resources').deleteMany({});
    
    // 2. Insert Departments
    const deptResult = await mongoose.connection.collection('departments').insertMany(departmentsData);
    const deptIds = {};
    Object.keys(deptResult.insertedIds).forEach(index => {
      deptIds[departmentsData[index].code] = deptResult.insertedIds[index];
    });

    // 3. Insert Modules
    const modulesWithDeptIds = modulesData.map(m => ({
      code: m.code,
      name: m.name,
      year: m.year,
      semester: m.semester,
      description: m.description,
      department: deptIds[m.deptCode]
    }));
    await mongoose.connection.collection('modules').insertMany(modulesWithDeptIds);
    console.log('Modules and Departments Seeded!');

    // 4. Create Master Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin1234', salt);

    await mongoose.connection.collection('users').insertOne({
      name: 'Master Admin',
      email: 'admin',
      passwordHash: passwordHash,
      role: 'admin',
      points: 1000,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Admin account created!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding Atlas:', error);
    process.exit(1);
  }
}

seedAtlas();
