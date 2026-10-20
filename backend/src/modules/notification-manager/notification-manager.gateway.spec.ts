import { Test, TestingModule } from '@nestjs/testing';
import { NotificationManagerGateway } from './notification-manager.gateway';

describe('NotificationManagerGateway', () => {
  let gateway: NotificationManagerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationManagerGateway],
    }).compile();

    gateway = module.get<NotificationManagerGateway>(NotificationManagerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
