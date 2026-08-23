import { Severity } from '../../common/enums/severity.enum';
import { IncidentSource } from '../../incidents/enums/incident-source.enum';

export class AnalyzeIncidentDto {
  incidentId!: string;
  service!: string;
  alert!: string;
  severity!: Severity;
  source!: IncidentSource;
  firstSeenAt!: Date;
  lastSeenAt!: Date;
  rawPayload!: Record<string, unknown>;
}