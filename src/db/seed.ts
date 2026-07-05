import { db } from './connection';
import { users, userProfiles } from './schemas/userSchema';
import { medicines } from './schemas/medicineSchema';

const seed = async () => {
    const appStage = process.env.APP_STAGE;
    
    if (appStage === 'production') {
        console.error('ERROR: Cannot run seed script in production environment!');
        console.error('Current APP_STAGE:', appStage);
        process.exit(1);
    }

    console.log(`Running seed in ${appStage} environment...`);
    console.log('starting seed...');

    try {
        console.log('deleting existing data...');
        await db.delete(medicines).execute();
        await db.delete(userProfiles).execute();
        await db.delete(users).execute();

        console.log('inserting seed data...');

        const insertedUsers = await db.insert(users).values([
            {
                email: 'alice@example.com',
                username: 'alice_smith',
                password: 'password1',
            },
        ]).returning();

        await db.insert(userProfiles).values([
            {
                user_id: insertedUsers[0].id,
                name: 'Alice Smith',
                identification_number: 'ID123456',
                age: 30,
                height: 165,
                weight: 60,
                blood_type: 'A+',
                gender: 'Female',
                phone_number: '123-456-7890',
                emergency_contact: '987-654-3210',
                emergency_person: 'John Doe',
                relationship: 'Friend',
                allergies: 'Milk, Eggs, Peanuts',
                conditions: 'Asthma',
            },
        ]).returning();

        await db.insert(medicines).values([
            {
                user_id: insertedUsers[0].id,
                name: 'Ambroxol',
                dailyDose: '10 ml (2 teaspoons)',
                timeTake: '8:00 am',
                startDate: '2026-06-14',
                endDate: '2026-06-20',
                expirationDate: '2027-01-01',
                icon: 'bottle',
            },
        ]).returning();

        console.log('Seed completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seed()
    .then(() => {
        console.log('Seed script finished.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1);
    });

export default seed;