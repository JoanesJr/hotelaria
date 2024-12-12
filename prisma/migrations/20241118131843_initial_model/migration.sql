-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "streeth" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "address_id" TEXT NOT NULL,
    "privilege_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "streeth" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "neighboor" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privilege" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "trailer" TEXT,
    "capa" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules_courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modules_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attchments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attchments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "aulaid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_comments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_course" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "initialDate" TIMESTAMP(3) NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "courseid" TEXT NOT NULL,

    CONSTRAINT "user_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupons" (
    "id" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "initialDate" TIMESTAMP(3) NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupons_courses" (
    "id" TEXT NOT NULL,
    "cupomid" TEXT NOT NULL,
    "courseid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cupons_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "courseid" TEXT NOT NULL,
    "statusid" TEXT NOT NULL,
    "cupomid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" TEXT NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_purchase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoursesToModulesCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClassCoursesToModulesCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AttachmentsToClassCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerCommentsToComments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_rg_key" ON "users"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "courses_categories_name_key" ON "courses_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "modules_courses_name_key" ON "modules_courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "status_purchase_name_key" ON "status_purchase"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CoursesToModulesCourses_AB_unique" ON "_CoursesToModulesCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_CoursesToModulesCourses_B_index" ON "_CoursesToModulesCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassCoursesToModulesCourses_AB_unique" ON "_ClassCoursesToModulesCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassCoursesToModulesCourses_B_index" ON "_ClassCoursesToModulesCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AttachmentsToClassCourses_AB_unique" ON "_AttachmentsToClassCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_AttachmentsToClassCourses_B_index" ON "_AttachmentsToClassCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerCommentsToComments_AB_unique" ON "_AnswerCommentsToComments"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerCommentsToComments_B_index" ON "_AnswerCommentsToComments"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "privilege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "courses_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_aulaid_fkey" FOREIGN KEY ("aulaid") REFERENCES "class_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_comments" ADD CONSTRAINT "answer_comments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupons_courses" ADD CONSTRAINT "cupons_courses_cupomid_fkey" FOREIGN KEY ("cupomid") REFERENCES "cupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupons_courses" ADD CONSTRAINT "cupons_courses_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_statusid_fkey" FOREIGN KEY ("statusid") REFERENCES "status_purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_cupomid_fkey" FOREIGN KEY ("cupomid") REFERENCES "cupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToModulesCourses" ADD CONSTRAINT "_CoursesToModulesCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoursesToModulesCourses" ADD CONSTRAINT "_CoursesToModulesCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "modules_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCoursesToModulesCourses" ADD CONSTRAINT "_ClassCoursesToModulesCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "class_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassCoursesToModulesCourses" ADD CONSTRAINT "_ClassCoursesToModulesCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "modules_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentsToClassCourses" ADD CONSTRAINT "_AttachmentsToClassCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "attchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttachmentsToClassCourses" ADD CONSTRAINT "_AttachmentsToClassCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "class_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerCommentsToComments" ADD CONSTRAINT "_AnswerCommentsToComments_A_fkey" FOREIGN KEY ("A") REFERENCES "answer_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerCommentsToComments" ADD CONSTRAINT "_AnswerCommentsToComments_B_fkey" FOREIGN KEY ("B") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
