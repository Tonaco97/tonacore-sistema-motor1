import { Controller, Post, Body } from '@nestjs/common';
import { TonaCoreFusionEngine } from '../../core/fusion-engine/tonacore-fusion.engine';

@Controller('tonacore')
export class TonaCoreController {
  constructor(private readonly fusionEngine: TonaCoreFusionEngine) {}

  @Post('fuse')
  async fuse(@Body() body: any) {
    return this.fusionEngine.fuse(body);
  }
}
