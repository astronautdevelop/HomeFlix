import { Test, TestingModule } from '@nestjs/testing';
import { NotificationManagerService } from './notification-manager.service';

describe('NotificationManagerService', () => {
  let service: NotificationManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationManagerService],
    }).compile();

    service = module.get<NotificationManagerService>(NotificationManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
