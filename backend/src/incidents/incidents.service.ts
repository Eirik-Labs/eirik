import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertDto } from 'src/webhook/dto/alert.dto';
import { Incident } from './entities/incidents.entity';
import { Repository } from 'typeorm';
import { IncidentStatus } from './enums/incident-status.enum';
import { IncidentSource } from './enums/incident-source.enum';
import { AlertStatus } from 'src/common/enums/alert-status.enum';
import { GetIncidentsQueryDto } from './dto/get-incident-query.dto';
import { Severity } from 'src/common/enums/severity.enum';
import { Brackets } from 'typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { TenantUtils } from 'src/common/utils/tenants.utils';
@Injectable()
export class IncidentsService {
    
    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepository: Repository<Incident>
    ){}

// this refers to the current IncidentsService object, 
// and this.incidentRepository is a property of that object.
// this refers to the current IncidentsService object, and 
// this.incidentRepository is a property of that object.

    createOrUpdateIncident(){}

    async findByFingerprint(fingerprint: string, organizationId:string){
        return this.incidentRepository.findOne({
            where:{
                fingerprint,
                organizationId
            }
        })
    }

    async getIncidentById(id: string, user: JwtPayload) {
       const incident = await this.incidentRepository.findOne({
         where: {
           id,
           ...TenantUtils.where(user),
         },
       });
     
       if (!incident) {
         throw new NotFoundException('No incident with this id exists');
       }
     
       return incident;
    }

    async processIncomingAlert(alert: AlertDto, organizationId:string){
        // const fingerprint = alert.fingerprint

        const existingIncident = await this.findByFingerprint(alert.fingerprint,organizationId)
         
        const incidentStatus= alert.status== AlertStatus.FIRING ?
         IncidentStatus.OPEN : IncidentStatus.CLOSED

        if(!existingIncident){
            // console.log("insert incident")
            const newIncident=  this.incidentRepository.create({
                fingerprint: alert.fingerprint,
                organizationId,
                title:alert.labels.alertname,
                severity: alert.labels.severity,
                source: IncidentSource.ALERTMANAGER,
                status: incidentStatus,
                alertCount:1,
                firstSeenAt: new Date(alert.startsAt),
                lastSeenAt: new Date(alert.startsAt),
                rawPayload: JSON.parse(JSON.stringify(alert))
            })

           await this.incidentRepository.save(newIncident)  // create simply creates an incident obj, we use save to persist it, since no id is there, a new insertion is made
        }
        else {
            // console.log('update incident')
            
            existingIncident.alertCount+=1
            existingIncident.lastSeenAt= new Date(alert.startsAt)  // when alertmanager sends the latest alert
            existingIncident.status= incidentStatus
            existingIncident.rawPayload= JSON.parse(JSON.stringify(alert))
            
            await this.incidentRepository.save(existingIncident) // if entry already exists, it updates the fields
        }

    }


    // async getAllIncidents(query: GetIncidentsQueryDto){
    //     const limit=query.limit ?? 10
    //     const page= query.page ?? 1
    //     const skip = (page-1)*limit
    //     const qb= this.incidentRepository.createQueryBuilder('incidents')

    //     if(query.status){
    //         qb.andWhere('incidents.status = :status',{
    //             status: query.status,
    //         })
    //     }
        
    //     if(query.severity){
    //         qb.andWhere('incidents.severity = :severity',{
    //             severity: query.severity
    //         })
    //     }

    //     if(query.source){
    //         qb.andWhere('incidents.source = :source',{
    //             source: query.source
    //         })
    //     }

    //     if(query.search){
    //         qb.andWhere(
    //             new Brackets((qb)=>{
    //                 qb.where('incidents.title ILIKE :search')
    //                 .orWhere('incidents.fingerprint ILIKE :search')
    //                 .orWhere('incidents.assignee ILIKE :search')
    //             }),
    //             {
    //                 search:`%${query.search}%`,
    //             },
    //         )
    //     }

    //     const [incidents, total] = await qb
    //     .orderBy('incidents.lastSeenAt', 'DESC')
    //     .skip(skip)
    //     .take(limit)
    //     .getManyAndCount();

    //     const totalPages = Math.ceil(total / limit);

    //     return {
    //         data: incidents,
    //         page,
    //         limit,
    //         total,
    //         totalPages,
    //     };
    // }

    async getAllIncidents(
       query: GetIncidentsQueryDto,
       user: JwtPayload,
     ) {
       const limit = query.limit ?? 10;
       const page = query.page ?? 1;
       const skip = (page - 1) * limit;
     
       const qb = this.incidentRepository
         .createQueryBuilder('incidents')
         .where('1=1');                   //dummy condition 
     
       const tenantFilter = TenantUtils.where(user);
     
       if (tenantFilter.organizationId) {            //for superadmin tenantFilter is {} and this filter does not work
         qb.andWhere('incidents.organizationId = :organizationId', {
           organizationId: tenantFilter.organizationId,
         });
       }
     
       if (query.status) {
         qb.andWhere('incidents.status = :status', {
           status: query.status,
         });
       }
     
       if (query.severity) {
         qb.andWhere('incidents.severity = :severity', {
           severity: query.severity,
         });
       }
     
       if (query.source) {
         qb.andWhere('incidents.source = :source', {
           source: query.source,
         });
       }
     
       if (query.search) {
         qb.andWhere(
           new Brackets((qb) => {
             qb.where('incidents.title ILIKE :search')
               .orWhere('incidents.fingerprint ILIKE :search')
               .orWhere('incidents.assignee ILIKE :search');
           }),
           {
             search: `%${query.search}%`,
           },
         );
       }
     
       const [incidents, total] = await qb
         .orderBy('incidents.lastSeenAt', 'DESC')
         .skip(skip)
         .take(limit)
         .getManyAndCount();
     
       const totalPages = Math.ceil(total / limit);
     
       return {
         data: incidents,
         page,
         limit,
         total,
         totalPages,
       };
    }

    async assignIncident(id:string, assignee:string, user:JwtPayload){
        const incident=  await this.getIncidentById(id,user)

        // if(!incident)throw new Error("no incident exists with this id") not required as getIncidentsById will already throw an error
        
        
        incident.assignee= assignee  
        incident.acknowledgedAt= new Date()  
        incident.status= IncidentStatus.ACKNOWLEDGED
    
        return await this.incidentRepository.save(incident)

    }

    async updateIncidentStatus(id:string, status:IncidentStatus, user:JwtPayload){
        const incident= await this.getIncidentById(id,user)

        incident.status=status

        return await this.incidentRepository.save(incident)
    }


    // get all the incident stats , for devs to have a bird eye view of the issues
    async getIncidentStats(user:JwtPayload){
        const tenantFilter= TenantUtils.where(user)
        const where= tenantFilter.organizationId ? {organizationId:tenantFilter.organizationId} : {}
        const [
            total,
            open,
            acknowledged,
            closed,
            critical,
            info, 
            warning,
        ]= await Promise.all([    //Promise.all() fires all the calls together to prevent waiting for sync calls,
            //node js doesnt execute SQL itself, it sends multiple req to postgres,
            //postgres processes them and node simply waits for the response

            this.incidentRepository.count({where}),
            this.incidentRepository.count({where:{...where, status:IncidentStatus.OPEN}}),
            this.incidentRepository.count({where:{...where, status:IncidentStatus.ACKNOWLEDGED}}),
            this.incidentRepository.count({where:{...where, status:IncidentStatus.CLOSED}}),
            this.incidentRepository.count({where:{...where, severity:Severity.CRITICAL}}),
            this.incidentRepository.count({where:{...where, severity:Severity.INFO}}),
            this.incidentRepository.count({where:{...where, severity:Severity.WARNING}}), 
        ])

        return {
          total,
          byStatus: {
            open,
            acknowledged,
            closed,
          },
          bySeverity: {
            info,
            warning,
            critical,
          },
        };
    }

}
