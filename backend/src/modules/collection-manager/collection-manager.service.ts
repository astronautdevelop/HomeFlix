import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  AddMediaToCollectionDto,
  UpdateOrderDto,
} from './dto/collection.dto';

@Injectable()
export class CollectionManagerService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(userId: string | null, dto: CreateCollectionDto) {
    return this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description,
        posterUrl: dto.posterUrl,
        backgroundUrl: dto.backgroundUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.collection.findMany({
      include: {
        _count: { select: { media: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        media: {
          orderBy: { order: 'asc' },
          include: {
            media: {
              select: {
                id: true,
                title: true,
                posterUrl: true,
                releaseYear: true,
                rating: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (!collection) throw new NotFoundException('Collezione non trovata');
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id);
    return this.prisma.collection.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        posterUrl: dto.posterUrl,
        backgroundUrl: dto.backgroundUrl,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // 🔥 Elimina TUTTE le immagini associate (poster + background)
    await this.uploadService.deleteImage(id);
    return this.prisma.collection.delete({ where: { id } });
  }

  async addMedia(collectionId: string, dto: AddMediaToCollectionDto) {
    await this.findOne(collectionId);

    const media = await this.prisma.media.findUnique({
      where: { id: dto.mediaId },
    });
    if (!media) throw new NotFoundException('Media non trovato');

    const maxOrder = await this.prisma.collectionMedia.aggregate({
      where: { collectionId },
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.collectionMedia.create({
      data: {
        collectionId,
        mediaId: dto.mediaId,
        order: dto.order ?? nextOrder,
      },
    });
  }

  async removeMedia(collectionId: string, mediaId: string) {
    const relation = await this.prisma.collectionMedia.findUnique({
      where: { collectionId_mediaId: { collectionId, mediaId } },
    });
    if (!relation) throw new NotFoundException('Media non presente in questa collezione');

    await this.prisma.collectionMedia.delete({
      where: { collectionId_mediaId: { collectionId, mediaId } },
    });
    return { success: true };
  }

  async updateOrder(collectionId: string, dto: UpdateOrderDto) {
    await this.findOne(collectionId);
    const updates = dto.mediaIds.map((mediaId, index) =>
      this.prisma.collectionMedia.update({
        where: { collectionId_mediaId: { collectionId, mediaId } },
        data: { order: index },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }

  async getCollectionsWithMedia() {
    return this.prisma.collection.findMany({
      include: {
        media: {
          orderBy: { order: 'asc' },
          include: {
            media: {
              select: {
                id: true,
                title: true,
                posterUrl: true,
                releaseYear: true,
                rating: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getMediaNotInCollection(collectionId: string) {
    const collectionMedia = await this.prisma.collectionMedia.findMany({
      where: { collectionId },
      select: { mediaId: true },
    });
    const excludedIds = collectionMedia.map((cm) => cm.mediaId);

    return this.prisma.media.findMany({
      where: { id: { notIn: excludedIds } },
      select: {
        id: true,
        title: true,
        posterUrl: true,
        releaseYear: true,
        rating: true,
        type: true,
      },
      orderBy: { title: 'asc' },
    });
  }
}