import { Module, HttpModule } from '@nestjs/common';
import {PrometheusGateway} from './prometheus.gateway';

@Module({
  imports: [HttpModule],
  providers: [PrometheusGateway]
})
export class PrometheusModule {}
