import { uuid } from 'drizzle-orm/pg-core/columns/uuid';
import {db} from './connection';
import {users, userProfiles} from './schemas/userSchema';
import { timestamp } from 'drizzle-orm/singlestore-core/columns/timestamp';

const seed = async () => {
    // PROTECTION: Prevent seeding in production
    const appStage = process.env.APP_STAGE;
    
    if (appStage === 'production') {
        console.error('ERROR: Cannot run seed script in production environment!');
        console.error('Current APP_STAGE:', appStage);
        process.exit(1); // Exit with error code
    }

    // confirmation for staging/test environments
    console.log(`Running seed in ${appStage} environment...`);
    console.log('starting seed...');

    try{
        console.log('deleting existing data...');
        await db.delete(users).execute();
        console.log('inserting seed data...');
        // Insert seed data
        // Users
        const insertedUsers = await db.insert(users).values([
            { email: 'alice@example.com', username: 'alice_smith', password: 'password1', },
            ]).returning();

        // User Profiles
        const insertedUserProfiles = await db.insert(userProfiles).values([
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

    console.log('Seed completed successfully!');
    
}catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }
}

if(require.main === module){
    seed().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}

export default seed;