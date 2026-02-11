import { useState, useEffect, useCallback } from "react";
import { Layout } from "../components/Layout";
import { CarsTable } from "../components/CarsTable";
import { Pagination } from "../components/Pagination";
import { Modal } from "../components/Modal";
import { ConfirmModal } from "../components/ConfirmModal";
import { CarForm } from "../components/CarForm";
import { CarDetails } from "../components/CarDetails";
import { SearchInput } from "../components/SearchInput";
import { useDebounce } from "../hooks/useDebounce";
import { getCars, createCar, updateCar, deleteCar } from "../api/cars";
import {
  Car,
  CarFormData,
  SortConfig,
  Pagination as PaginationType,
} from "../types";

export const CarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCars({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        sortBy: sortConfig?.field,
        sortOrder: sortConfig?.order,
      });

      if (response.data) {
        setCars(response.data);
      }
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить автомобили");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, sortConfig]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev?.field !== field) return { field, order: "asc" };
      if (prev.order === "asc") return { field, order: "desc" };
      return null;
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleAddCar = async (data: CarFormData) => {
    setIsSubmitting(true);
    try {
      await createCar(data);
      setIsAddModalOpen(false);
      fetchCars();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCar = async (data: CarFormData) => {
    if (!selectedCar) return;

    setIsSubmitting(true);
    try {
      await updateCar(selectedCar.id, data);
      setIsEditModalOpen(false);
      setSelectedCar(null);
      fetchCars();
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCar = async () => {
    if (!selectedCar) return;

    setIsSubmitting(true);
    try {
      await deleteCar(selectedCar.id);
      setIsDeleteModalOpen(false);
      setSelectedCar(null);
      fetchCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить автомобиль");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (car: Car) => {
    setSelectedCar(car);
    setIsViewModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setSelectedCar(car);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (car: Car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors ml-auto"
          >
            Добавить
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Поиск по бренду, модели, VIN ..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <CarsTable
              cars={cars}
              sortConfig={sortConfig}
              onSort={handleSort}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить автомобиль"
      >
        <CarForm
          onSubmit={handleAddCar}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCar(null);
        }}
        title={
          selectedCar
            ? `${selectedCar.brand} ${selectedCar.model}`
            : "Детализация"
        }
      >
        {selectedCar && <CarDetails car={selectedCar} />}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCar(null);
        }}
        title="Редактировать автомобиль"
      >
        {selectedCar && (
          <CarForm
            car={selectedCar}
            onSubmit={handleEditCar}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedCar(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCar(null);
        }}
        onConfirm={handleDeleteCar}
        title="Удалить автомобиль"
        message={
          selectedCar
            ? `Вы уверены, что хотите удалить ${selectedCar.brand} ${selectedCar.model}? Это действие нельзя отменить.`
            : ""
        }
        confirmText="Удалить"
        isLoading={isSubmitting}
      />
    </Layout>
  );
};
