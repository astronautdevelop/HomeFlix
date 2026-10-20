import { Test, TestingModule } from '@nestjs/testing';
import { PlayerEngineService } from './player-engine.service';

describe('PlayerEngineService', () => {
  let service: PlayerEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerEngineService],
    }).compile();

    service = module.get<PlayerEngineService>(PlayerEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
