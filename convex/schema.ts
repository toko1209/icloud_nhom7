import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  students: defineTable({
    studentId: v.string(), // Mã SV (VD: SV.1111)
    name: v.string(),      // Họ tên
    phone: v.string(),     // SĐT
    dob: v.string(),       // Ngày sinh
    gender: v.string(),    // Giới tính
    classification: v.string(), // Xếp loại (A, B, C)
  }),
});
