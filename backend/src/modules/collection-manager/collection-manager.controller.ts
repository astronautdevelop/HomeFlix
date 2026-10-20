import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollectionManagerService } from './collection-manager.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddMediaToCollectionDto,
  UpdateOrderDto,
} from './dto/collection.dto';

@Controller('collections') // 🔥 Rimosso 'api/' — gestito dal global prefix
export class CollectionManagerController {
  constructor(private readonly collectionService: CollectionManagerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionService.create(null, dto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  // 🔥 Route statiche PRIMA di quelle dinamiche (:id)
  @Get('detailed/all')
  getAllWithMedia() {
    return this.collectionService.getCollectionsWithMedia();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.collectionService.remove(id);
  }

  @Post(':id/media')
  @HttpCode(HttpStatus.CREATED)
  addMedia(@Param('id') id: string, @Body() dto: AddMediaToCollectionDto) {
    return this.collectionService.addMedia(id, dto);
  }

  @Delete(':id/media/:mediaId')
  @HttpCode(HttpStatus.OK)
  removeMedia(@Param('id') id: string, @Param('mediaId') mediaId: string) {
    return this.collectionService.removeMedia(id, mediaId);
  }

  @Put(':id/order')
  @HttpCode(HttpStatus.OK)
  updateOrder(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.collectionService.updateOrder(id, dto);
  }

  @Get(':id/media/available')
  getAvailableMedia(@Param('id') id: string) {
    return this.collectionService.getMediaNotInCollection(id);
  }
}