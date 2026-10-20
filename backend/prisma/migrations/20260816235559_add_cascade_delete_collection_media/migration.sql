-- DropForeignKey
ALTER TABLE "CollectionMedia" DROP CONSTRAINT "CollectionMedia_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "CollectionMedia" DROP CONSTRAINT "CollectionMedia_mediaId_fkey";

-- AddForeignKey
ALTER TABLE "CollectionMedia" ADD CONSTRAINT "CollectionMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionMedia" ADD CONSTRAINT "CollectionMedia_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
