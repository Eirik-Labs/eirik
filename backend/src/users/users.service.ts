import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
            @InjectRepository(User)
            private readonly usersRepository: Repository<User>
        ){}

    async findByEmail(email:string){
      const user = await this.usersRepository.findOne({
        where:{
            email,
        }
      })
      
      if(!user)throw new NotFoundException(`User with email ${email} not found`);

      return user;
    }

    async create(createUserDto: CreateUserDto) {
         const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
         
         if(existingUser) {
            throw new ConflictException(`User with email ${createUserDto.email} already exists`);
         }

         const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

         const user = this.usersRepository.create({
          ...createUserDto,
          password: hashedPassword
         })

         return this.usersRepository.save(user)
    }

    async findById(id:string){
      const user = await this.usersRepository.findOne({
        where :{id}
      })
      if(!user)throw new NotFoundException(`User not found`);
      return user;
    }

    async findAll(organizationId: string){
      return this.usersRepository.find({
        where:{
          organizationId
        },
        order :{
          createdAt: 'DESC'
        }

      })
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
      const user = await this.findById(id);
      Object.assign(user, updateUserDto)

      return this.usersRepository.save(user)

    }

    async deactivate(id: string){
       const user = await this.findById(id);
       user.isActive=false;
       await this.usersRepository.save(user)
       return {
        message: `User has been deactivated`,
       }
    }
     
    async activate(id: string){
       const user = await this.findById(id);
       user.isActive=true;
        await this.usersRepository.save(user)
       return {
        message: `User has been activated`,
       }
    }    
    
    async softDelete(id: string){
      const user = await this.findById(id)
      await this.usersRepository.softDelete(user.id)
      return {
        message: `User has been deleted`,
      }
    }
    
    async restore(id: string) {
     const result = await this.usersRepository.restore(id);
     if (result.affected === 0) {
       throw new NotFoundException('User not found');
     }
     return {
       message: `User has been restored`,
     }
   }
}


// You now have three user states:

// State	isActive	deletedAt	Can Login?
// Active	true	NULL	✅
// Suspended	false	NULL	❌
// Deleted	false (or true, depending on your choice)	Timestamp	❌
