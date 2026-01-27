
import { Module } from '@nestjs/common';
import { SecureIngestionGuard } from './orchestrator/secure-ingestion.guard';
import { KafkaManagerService } from './infrastructure/kafka-manager.service';
import { RedisStateService } from './data-optimizer/redis-state.service';

@Module({
  providers: [
    SecureIngestionGuard,
    KafkaManagerService,
    RedisStateService,
  ],
  exports: [
    KafkaManagerService,
    RedisStateService,
  ],
})
export class ShieldOrchestratorModule {}
