import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organizations')
export class Organization{

    @PrimaryGeneratedColumn('uuid')
    id!:string

    @Column({unique:true})
    name!:string

    @Column({unique:true})
    slug!:string
    
    @Column({unique:true, nullable:true})
    webhookSecret?:string

    @Column({nullable:true})
    logoUrl?:string

    @Column({default:true})
    isActive?:boolean

    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
}









