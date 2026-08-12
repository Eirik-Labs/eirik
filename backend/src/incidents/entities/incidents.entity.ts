import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IncidentSource } from '../enums/incident-source.enum';
import { IncidentStatus } from '../enums/incident-status.enum';
import { Severity } from '../../common/enums/severity.enum';
@Entity('incidents')
export class Incident {
    @PrimaryGeneratedColumn('uuid')
    id!:string

    @Index({unique:true})
    @Column()
    fingerprint!: string;

    @Column()
    title!: string;

    @Column({
      type:'enum',
      enum:IncidentStatus,
      default:IncidentStatus.OPEN
    })
    status!:IncidentStatus


    @Column({
    type: 'enum',
    enum: IncidentSource,
    })
    source!: IncidentSource;  //there is no default here bcs we want that if src is not provided, insertion should fail

    @Column({
    type: 'enum',
    enum: Severity,
    })
    severity!: Severity;
    

    @Column({
    default: 1,
    })
    alertCount!: number;
    
    @Column()
    organizationId!: string;

    @Column({
      type:'timestamptz'
    })
    firstSeenAt!:Date

    @Column({
      type:'timestamptz'
    })
    lastSeenAt!:Date

    @Column({
      type:'jsonb'
    })
    rawPayload!:Record<string,unknown>  // we store the full webhook object here
    //later if alertmanager adds a new field , the schema won't change, this is why jsonb is 
    //widely used in systems that consume external apis
    
    @CreateDateColumn({
      type:'timestamptz'
    })
    createdAt!:Date
    // TypeORM sets it automatically.

    @UpdateDateColumn({
      type:'timestamptz'
    })
    updatedAt!:Date
    // TypeORM updates this timestamp automatically.

    @Column({nullable:true})
    assignee?:string

    @Column({
      type:'timestamptz',
      nullable:true
    })
    acknowledgedAt?: Date

    @Column({
      type:'timestamptz',
      nullable:true
    })
    resolvedAt?:Date
  }