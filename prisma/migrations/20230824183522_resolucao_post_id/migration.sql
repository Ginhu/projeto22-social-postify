/*
  Warnings:

  - You are about to drop the column `postsId` on the `publications` table. All the data in the column will be lost.
  - Added the required column `postId` to the `publications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "publications" DROP CONSTRAINT "publications_postsId_fkey";

-- AlterTable
ALTER TABLE "publications" DROP COLUMN "postsId",
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
