const { db, run } = require('../config/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    // Give sqlite3 a moment to create tables from db.js
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Clearing existing data...');
    try {
        await run('DELETE FROM Appointments');
        await run('DELETE FROM Doctors');
        await run('DELETE FROM Users');
    } catch (e) {
        console.log('Note: Tables might be empty or locked, continuing...', e.message);
    }

    console.log('Seeding Database...');

    try {
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const docPassword = await bcrypt.hash('doc123', salt);
        const patPassword = await bcrypt.hash('pat123', salt);

        // 1. Create Admin
        await run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Admin User', 'admin@hospital.com', adminPassword, 'admin']);

        // 2. Create Doctors
        const d1 = await run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Dr. Alice Smith', 'alice@hospital.com', docPassword, 'doctor']);
        const d2 = await run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Dr. Bob Jones', 'bob@hospital.com', docPassword, 'doctor']);
        const d3 = await run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Dr. Clara Evans', 'clara@hospital.com', docPassword, 'doctor']);

        await run('INSERT INTO Doctors (user_id, specialization) VALUES (?, ?)', [d1.id, 'Cardiologist']);
        await run('INSERT INTO Doctors (user_id, specialization) VALUES (?, ?)', [d2.id, 'Dermatologist']);
        await run('INSERT INTO Doctors (user_id, specialization) VALUES (?, ?)', [d3.id, 'Pediatrician']);

        // 3. Create Default Patient
        await run('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', 
            ['Test Patient', 'patient@hospital.com', patPassword, 'patient']);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error.message);
    } finally {
        db.close();
    }
};

seedDatabase();
