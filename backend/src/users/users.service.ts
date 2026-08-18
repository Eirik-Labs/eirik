import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {TenantUtils} from '../common/utils/tenants.utils'
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {

    private readonly logger= new Logger(UsersService.name)

    constructor(
            @InjectRepository(User)
            private readonly usersRepository: Repository<User>
        ){}

    async findByEmail(email:string){
      const user = await this.usersRepository.findOne({
        where:{
            email
        }
      })
      
      // if(!user)throw new NotFoundException(`User with email ${email} not found`);

      return user;
    }

    async create(createUserDto: CreateUserDto, currentUser: JwtPayload) {
     
         const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email, organizationId: currentUser.organizationId } });
         
         if(existingUser) {
            this.logger.warn(`User creation rejected: email already exists`);
            throw new ConflictException(`User with email ${createUserDto.email} already exists`);
         }
         
         const role= createUserDto.role ?? UserRole.ENGINEER
         if(role==UserRole.SUPERADMIN){
            this.logger.warn(`User creation rejected: invalid role`);
            throw new ForbiddenException('Invalid role')
         }
         const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

         const user = this.usersRepository.create({
          ...createUserDto,
          password: hashedPassword,
          organizationId: currentUser.organizationId
         })

         try {
          const savedUser = await this.usersRepository.save(user);
        
          this.logger.log(`User created: ${savedUser.id}`);
        
          return savedUser;
        } catch (error) {
          this.logger.error(`Failed to create user`, error);
        
          throw error;
        }
    }

    async findById(id:string, currentUser: JwtPayload){
      const user = await this.usersRepository.findOne({
        where :{id, ...TenantUtils.where(currentUser),}
      })
      if(!user)throw new NotFoundException(`User not found`);
      return user;
    }

    async findAll(currentUser: JwtPayload){
      return this.usersRepository.find({
        where:{
          ...TenantUtils.where(currentUser),
        },
        order :{
          createdAt: 'DESC'
        }

      })
    }

    async update(id: string, updateUserDto: UpdateUserDto, currentUser: JwtPayload) {
      const user = await this.findById(id, currentUser);
      Object.assign(user, updateUserDto)

      const updatedUser= this.usersRepository.save(user)

      this.logger.log(`User updated: ${id}`)

      return updatedUser

    }

    async deactivate(id: string, currentUser: JwtPayload){
       const user = await this.findById(id, currentUser);
       user.isActive=false;
       await this.usersRepository.save(user)
       this.logger.log(`User deactivated: ${id}`);
       return {
        message: `User has been deactivated`,
       }
    }
     
    async activate(id: string, currentUser: JwtPayload){
       const user = await this.findById(id, currentUser);
       user.isActive=true;
       await this.usersRepository.save(user)
       this.logger.log(`User activated: ${id}`);
       return {
        message: `User has been activated`,
       }
    }    
    
    async softDelete(id: string, currentUser: JwtPayload){
      const user = await this.findById(id, currentUser)
      await this.usersRepository.softDelete(user.id)
      this.logger.log(`User soft-deleted: ${id}`);
      return {
        message: `User has been deleted`,
      }
    }
    
    async restore(id: string, currentUser: JwtPayload) {
      const user = await this.usersRepository.findOne({
        where: {id, ...TenantUtils.where(currentUser)},
        withDeleted: true
      })
      if(!user) throw new NotFoundException('User not found');
     const result = await this.usersRepository.restore(user.id);
     this.logger.log(`User restored: ${id}`);
    //  if (result.affected === 0) {
    //    throw new NotFoundException('User not found');
    //  }
     if (!user.deletedAt) {
     throw new ConflictException('User is not deleted');
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
