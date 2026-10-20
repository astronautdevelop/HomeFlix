import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationManagerService } from '../../modules/notification-manager/notification-manager.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private notificationService: NotificationManagerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          // Log solo se non è una richiesta di health check o asset statici
          if (!url.includes('/health') && !url.includes('/assets')) {
            const message = `${method} ${url} → ${statusCode} (${duration}ms)`;
            if (statusCode >= 400) {
              this.notificationService.notify('error', message, { statusCode, duration });
            } else if (statusCode >= 300) {
              this.notificationService.notify('warning', message, { statusCode, duration });
            } else {
              this.notificationService.notify('info', message, { statusCode, duration });
            }
          }
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.notificationService.notify('error', `${method} ${url} → ${error.message}`, {
            duration,
            stack: error.stack,
          });
        },
      }),
    );
  }
}