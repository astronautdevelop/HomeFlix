import { Test, TestingModule } from '@nestjs/testing';
import { PlayerEngineController } from './player-engine.controller';

describe('PlayerEngineController', () => {
  let controller: PlayerEngineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerEngineController],
    }).compile();

    controller = module.get<PlayerEngineController>(PlayerEngineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
