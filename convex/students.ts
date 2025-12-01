import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. LẤY DANH SÁCH SINH VIÊN
export const getStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("students").order("desc").collect();
  },
});

// 2. THÊM SINH VIÊN MỚI
export const addStudent = mutation({
  args: {
    studentId: v.string(),
    name: v.string(),
    phone: v.string(),
    dob: v.string(),
    gender: v.string(),
    classification: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("students", args);
  },
});

// 3. XÓA SINH VIÊN (AN TOÀN HƠN)
export const deleteStudent = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    // Kiểm tra xem sinh viên này có tồn tại không trước khi xóa
    const existing = await ctx.db.get(args.id);
    
    if (existing) {
      await ctx.db.delete(args.id);
    }
    // Nếu không tồn tại (đã bị xóa rồi), hàm sẽ tự kết thúc êm đẹp, không báo lỗi đỏ.
  },
});

// 4. SỬA TOÀN BỘ THÔNG TIN SINH VIÊN
export const updateStudent = mutation({
  args: {
    id: v.id("students"),
    studentId: v.string(),
    name: v.string(),
    phone: v.string(),
    dob: v.string(),
    gender: v.string(),
    classification: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    
    if (existing) {
      await ctx.db.patch(id, data);
    }
  },
});
