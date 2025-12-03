import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Search, Plus, Trash2, Pencil, User, UserCircle, X, Save } from 'lucide-react';

export default function App() {
  // --- KẾT NỐI BACKEND ---
  const students = useQuery(api.students.getStudents) || [];
  const addStudent = useMutation(api.students.addStudent);
  const deleteStudent = useMutation(api.students.deleteStudent);
  const updateStudent = useMutation(api.students.updateStudent);

  // --- LOCAL STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Nếu null là đang Thêm mới

  // State cho Form
  const initialForm = {
    studentId: '', name: '', phone: '', dob: '', gender: 'Nam', classification: 'A'
  };
  const [formData, setFormData] = useState(initialForm);

  // Mở form để THÊM
  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // Mở form để SỬA
  const openEditModal = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      phone: student.phone,
      dob: student.dob,
      gender: student.gender,
      classification: student.classification
    });
    setIsModalOpen(true);
  };

  // Xử lý LƯU (Thêm hoặc Sửa)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Gọi hàm Sửa
      updateStudent({ id: editingId, ...formData });
    } else {
      // Gọi hàm Thêm
      addStudent(formData);
    }
    setIsModalOpen(false); // Đóng form
  };

  // Lọc tìm kiếm
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankColor = (rank) => {
    if (rank === 'A' || rank === 'Giỏi') return 'text-red-500 font-bold';
    if (rank === 'B' || rank === 'Khá') return 'text-blue-500 font-bold';
    return 'text-gray-500 font-bold';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-700 relative">

      {/* --- HEADER --- */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <UserCircle className="w-10 h-10 text-blue-600" />
          Quản Lý Sinh Viên Của ST22B nhóm 7
        </h1>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo Tên hoặc Mã SV..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Thêm Sinh Viên
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 w-10 text-center">#</th>
                <th className="p-4">Mã SV</th>
                <th className="p-4">Họ và Tên</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Ngày sinh</th>
                <th className="p-4">Giới tính</th>
                <th className="p-4 text-center">Xếp loại</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Không tìm thấy sinh viên nào.</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-center text-slate-400 font-medium">{index + 1}</td>
                    <td className="p-4 font-semibold text-slate-700">{student.studentId}</td>
                    <td className="p-4 font-medium text-slate-800">{student.name}</td>
                    <td className="p-4 text-slate-500 font-mono text-sm">{student.phone}</td>
                    <td className="p-4 text-slate-500">{student.dob}</td>
                    <td className="p-4 text-slate-600">{student.gender}</td>
                    <td className="p-4 text-center"><span className={getRankColor(student.classification)}>{student.classification}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(student)} className="w-9 h-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteStudent({ id: student._id })} className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL FORM (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên Mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã SV</label>
                <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên</label>
                <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Số ĐT</label>
                <input required type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh</label>
                <input required type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                <select className="w-full p-2 border rounded-lg outline-none"
                  value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Xếp loại</label>
                <select className="w-full p-2 border rounded-lg outline-none"
                  value={formData.classification} onChange={e => setFormData({...formData, classification: e.target.value})}>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>Giỏi</option>
                  <option>Khá</option>
                </select>
              </div>

              <div className="col-span-2 pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? 'Lưu Thay Đổi' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
