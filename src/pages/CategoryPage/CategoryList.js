import React, { useEffect, useState, useMemo } from "react";
import { getCategory, deleteCategory } from "../../services/CategoryService/CategoryServices";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Plus, Edit, Trash2 } from "lucide-react";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import DeleteModal from "../../components/DeleteModal";

// Type definition for Category
const Category = {
  categoryName: "",
  description: "",
  status: null,
  createdAt: "",
  updateAt: ""
};


export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [itemToUpdate, setItemToUpdate] = useState(null)
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0
  })

  // Fetch data from API
  const fetchData = async (searchParams = {}) => {
    try {
      setLoading(true)
      const response = await getCategory({
        search: searchParams.search !== undefined ? searchParams.search : "",
        pageNumber: searchParams.pageNumber !== undefined ? searchParams.pageNumber : 1,
        pageSize: searchParams.pageSize !== undefined ? searchParams.pageSize : 10
      })
      
      if (response && response.data) {
        // API returns response.data.items (array) and response.data.totalCount
        const dataArray = Array.isArray(response.data.items) ? response.data.items : []
        setCategories(dataArray)
        setPagination(prev => ({
          ...prev,
          totalCount: response.data.totalCount || dataArray.length
        }))
      } else {
        setCategories([])
        setPagination(prev => ({ ...prev, totalCount: 0 }))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
      setPagination(prev => ({ ...prev, totalCount: 0 }))
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchData()
  }, [])

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData({ search: searchQuery || "", pageNumber: 1, pageSize: 10 })
      setPagination(prev => ({ ...prev, pageNumber: 1, pageSize: 10 }))
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 inline" />
    )
  }

  const filteredAndSortedCategories = useMemo(() => {
    // Ensure categories is always an array
    const categoriesArray = Array.isArray(categories) ? categories : []
    
    const filtered = categoriesArray.filter(
      (category) =>
        category.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      })
    }

    return filtered
  }, [searchQuery, sortColumn, sortDirection, categories])

  const activeCount = Array.isArray(categories) ? categories.filter((c) => c.status === 1).length : 0
  const inactiveCount = Array.isArray(categories) ? categories.filter((c) => c.status === 2).length : 0

  const handleCreateSuccess = () => {
    // Refresh data after successful creation
    fetchData()
  }

  const handleUpdateClick = (category) => {
    setItemToUpdate(category)
    setShowUpdateModal(true)
  }

  const handleDeleteClick = (category) => {
    setItemToDelete(category)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting category:", itemToDelete)
      await deleteCategory(itemToDelete?.categoryId)
      alert(`Đã xóa danh mục: ${itemToDelete?.categoryName || ''}`)
      setShowDeleteModal(false)
      setItemToDelete(null)
      // Refresh data after deletion
      fetchData()
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Có lỗi xảy ra khi xóa danh mục")
    }
  }

  const handleUpdateCancel = () => {
    setShowUpdateModal(false)
    setItemToUpdate(null)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quản lý Danh mục</h1>
            <p className="text-slate-600 mt-1">Quản lý các danh mục sản phẩm trong hệ thống</p>
          </div>
          <Button 
            className="bg-[#237486] hover:bg-[#1e5f6b] h-11 px-6 text-white"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#237486]">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-slate-600">Tổng danh mục</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">{pagination.totalCount}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#237486]">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-slate-600">Đang hoạt động</div>
              <div className="text-3xl font-bold text-[#237486] mt-2">{activeCount}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[#237486]">
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-slate-600">Không hoạt động</div>
              <div className="text-3xl font-bold text-slate-600 mt-2">{inactiveCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mô tả danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card className="shadow-lg overflow-hidden p-0">
          <div className="w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-slate-600">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-[#237486] hover:bg-[#237486] m-0 w-full">
                      <TableHead className="font-semibold text-white px-4 py-3 first:pl-6 last:pr-6 border-0 w-20">
                        STT
                      </TableHead>
                      <TableHead
                        className="cursor-pointer font-semibold text-white px-4 py-3 first:pl-6 last:pr-6 border-0 w-40"
                        onClick={() => handleSort("categoryName")}
                      >
                        Tên danh mục {getSortIcon("categoryName")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer font-semibold text-white px-4 py-3 first:pl-6 last:pr-6 border-0"
                        onClick={() => handleSort("description")}
                      >
                        Mô tả {getSortIcon("description")}
                      </TableHead>
                        <TableHead className="font-semibold text-white px-4 py-3 first:pl-6 last:pr-6 border-0 w-40">
                          Trạng thái
                        </TableHead>
                      <TableHead
                        className="cursor-pointer font-semibold text-white px-4 py-3 first:pl-6 last:pr-6 border-0 w-40"
                        onClick={() => handleSort("createdAt")}
                      >
                        Ngày tạo {getSortIcon("createdAt")}
                      </TableHead>
                        <TableHead className="font-semibold text-white px-4 py-3 first:pl-6 last:pr-6 border-0 text-center">
                          Hoạt động
                        </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCategories.length > 0 ? (
                      filteredAndSortedCategories.map((category, index) => (
                        <TableRow
                          key={index}
                          className={`
                            ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                            hover:bg-[#e6f4f4] transition-colors duration-150 m-0 w-full
                          `}
                        >
                          <TableCell className="text-slate-600 px-4 py-3 first:pl-6 last:pr-6 border-0 w-20 text-center font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 px-4 py-3 first:pl-6 last:pr-6 border-0 w-40">{category?.categoryName || ''}</TableCell>
                          <TableCell className="text-slate-700 px-4 py-3 first:pl-6 last:pr-6 border-0">{category?.description || ''}</TableCell>
                          <TableCell className="text-slate-700 px-4 py-3 first:pl-6 last:pr-6 border-0 w-40 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              category?.status === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category?.status === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600 px-4 py-3 first:pl-6 last:pr-6 border-0 w-40">{category?.createdAt || ''}</TableCell>
                          <TableCell className="text-slate-600 px-4 py-3 first:pl-6 last:pr-6 border-0 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                                title="Chỉnh sửa"
                                onClick={() => handleUpdateClick(category)}
                              >
                                <Edit className="h-4 w-4 text-[#1a7b7b]" />
                              </button>
                              <button 
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                                title="Xóa"
                                onClick={() => handleDeleteClick(category)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                          Không tìm thấy danh mục nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Card>

        {/* Pagination */}
        {!loading && pagination.totalCount > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Hiển thị {((pagination.pageNumber - 1) * pagination.pageSize) + 1} - {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} trong tổng số {pagination.totalCount} danh mục
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (pagination.pageNumber > 1) {
                        fetchData({ pageNumber: pagination.pageNumber - 1, pageSize: 10 })
                        setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber - 1, pageSize: 10 }))
                      }
                    }}
                    disabled={pagination.pageNumber <= 1}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-slate-600">
                    Trang {pagination.pageNumber} / {Math.ceil(pagination.totalCount / pagination.pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (pagination.pageNumber < Math.ceil(pagination.totalCount / pagination.pageSize)) {
                        fetchData({ pageNumber: pagination.pageNumber + 1, pageSize: 10 })
                        setPagination(prev => ({ ...prev, pageNumber: prev.pageNumber + 1, pageSize: 10 }))
                      }
                    }}
                    disabled={pagination.pageNumber >= Math.ceil(pagination.totalCount / pagination.pageSize)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Category Modal */}
      <CreateCategory
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Update Category Modal */}
      <UpdateCategory
        isOpen={showUpdateModal}
        onClose={handleUpdateCancel}
        onSuccess={handleCreateSuccess}
        categoryData={itemToUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.categoryName || ""}
      />
    </div>
  )
}
