-- CreateTable
CREATE TABLE "activities" (
    "auid" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("auid")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" SERIAL NOT NULL,
    "activity_uid" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "total_hour" INTEGER NOT NULL,
    "date_string" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "activity_uid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant_certificate" (
    "id" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL,
    "cid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participant_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_certificate_pid_cid_key" ON "participant_certificate"("pid", "cid");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_activity_uid_fkey" FOREIGN KEY ("activity_uid") REFERENCES "activities"("auid") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_activity_uid_fkey" FOREIGN KEY ("activity_uid") REFERENCES "activities"("auid") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participant_certificate" ADD CONSTRAINT "participant_certificate_pid_fkey" FOREIGN KEY ("pid") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participant_certificate" ADD CONSTRAINT "participant_certificate_cid_fkey" FOREIGN KEY ("cid") REFERENCES "certificates"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
