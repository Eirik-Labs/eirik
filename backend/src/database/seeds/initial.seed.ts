import 'reflect-metadata'
import * as bcrypt from 'bcrypt';
import 'dotenv/config'
import { AppDataSource } from '../data-source';
import { Organization } from '../../organizations/entities/organizations.entity';
import { User } from '../../users/entities/users.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { randomBytes } from 'crypto';

async function seed(){
    await AppDataSource.initialize()

    try{
        const organizationRepository= AppDataSource.getRepository(Organization);
        const userRepository = AppDataSource.getRepository(User)

        const superAdminEmail=process.env.SUPERADMIN_EMAIL
        const superAdminPassword= process.env.SUPERADMIN_PASSWORD

        if (!superAdminEmail || !superAdminPassword) {
          throw new Error(
            'SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be defined in .env',
          );
        }

         //find or create internal organization
         let organization = await organizationRepository.findOne({
            where:{
                slug:'eirik-internal'
            },
         })
         
         if(!organization){
            const webhookSecret = randomBytes(32).toString('hex');
            organization= organizationRepository.create({
                name:'Eirik-Internal',
                slug:'eirik-internal',
                webhookSecret
            })

            organization= await organizationRepository.save(organization)

            console.log('internal organization created')
         }
         else{
            console.log('internal organization already exists')
         }

         //find or create superAdmin
         let superAdmin= await userRepository.findOne({
            where:{
                email:superAdminEmail
            }
         })

         if(!superAdmin){
            const hashedPassword= await bcrypt.hash(superAdminPassword, 10)
         

            superAdmin=  userRepository.create({
            name: 'System Administrator',
            email: superAdminEmail,
            password: hashedPassword,
            role: UserRole.SUPERADMIN,
            organizationId: organization.id,
            isActive: true,
             })
    
            await userRepository.save(superAdmin) 
            console.log('superAdmin created')
        }   
        else {
             console.log('superadmin already exists')
        }
        
        console.log('seeding completed successfully')
    }
    finally{
        await AppDataSource.destroy()
    }

   
}

seed().catch((error)=>{
    console.error('seeding failed:', error)
    process.exit(1)
})





