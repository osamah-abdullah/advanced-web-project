import Sidebar from "./Sidebar";
import { useState, useEffect, useRef } from "react";
function Village() {
  const [userRole, setUserRole] = useState("");
  const [allVillages, setAllVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDemographicModalOpen, setIsDemographicModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [newVillage, setNewVillage] = useState({
    name: "",
    region: "",
    landArea: "",
    latitude: "",
    longitude: "",
    tags: "",
    image: null,
  });
  const villagesPerPage = 5;

  const chartRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Set user role
    setUserRole(sessionStorage.getItem("userRole") || "");

    // Fetch villages or load from localStorage
    fetchVillages();

    // Cleanup function
    return () => {
      // Cleanup chart if it exists
      if (chartRef.current?.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
      // Cleanup map if it exists
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await fetch("v.json");
      if (!response.ok) throw new Error("Failed to fetch village data");
      const villages = await response.json();

      // Validate data before setting state
      if (Array.isArray(villages)) {
        setAllVillages(villages);
        setFilteredVillages(villages);
        localStorage.setItem("villages", JSON.stringify(villages));
      } else {
        throw new Error("Invalid village data format");
      }
    } catch (error) {
      console.error("Error fetching villages:", error);

      try {
        const storedVillages = JSON.parse(
          localStorage.getItem("villages") || "[]"
        );
        if (Array.isArray(storedVillages) && storedVillages.length > 0) {
          setAllVillages(storedVillages);
          setFilteredVillages(storedVillages);
        } else {
          throw new Error("No valid backup data");
        }
      } catch (localStorageError) {
        console.error("Error loading from localStorage:", localStorageError);
        setAllVillages([]);
        setFilteredVillages([]);
        alert("Error loading villages. Please try refreshing the page.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVillage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewVillage((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleAddVillage = (e) => {
    e.preventDefault();

    // Generate new ID
    const newId =
      allVillages.length > 0
        ? Math.max(...allVillages.map((v) => v.id)) + 1
        : 0;

    // Create new village object
    const village = {
      ...newVillage,
      id: newId,
      tags: newVillage.tags.split(",").map((tag) => tag.trim()),
      image: newVillage.image ? newVillage.image.name : "default.jpg",
    };

    // Update state and localStorage
    const updatedVillages = [...allVillages, village];
    setAllVillages(updatedVillages);
    setFilteredVillages(updatedVillages);
    localStorage.setItem("villages", JSON.stringify(updatedVillages));

    // Reset form and close modal
    setNewVillage({
      name: "",
      region: "",
      landArea: "",
      latitude: "",
      longitude: "",
      tags: "",
      image: null,
    });
    setIsModalOpen(false);

    alert("Village added successfully!");
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setFilteredVillages(
      allVillages.filter((village) =>
        village.name.toLowerCase().includes(searchTerm)
      )
    );
    setCurrentPage(1);
  };

  const handleSort = (event) => {
    const sortOption = event.target.value;
    const sortedVillages = [...filteredVillages];

    if (sortOption === "alphabetical") {
      sortedVillages.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Reset to original order
      setFilteredVillages([...allVillages]);
      return;
    }

    setFilteredVillages(sortedVillages);
    setCurrentPage(1);
  };

  const handlePagination = (direction) => {
    const totalPages = Math.ceil(filteredVillages.length / villagesPerPage);
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getVillagesForCurrentPage = () => {
    const startIndex = (currentPage - 1) * villagesPerPage;
    const endIndex = startIndex + villagesPerPage;
    return filteredVillages.slice(startIndex, endIndex);
  };

  const handleViewVillage = (village) => {
    setSelectedVillage(village);
    setIsViewModalOpen(true);
  };

  const handleUpdateVillage = (village) => {
    setSelectedVillage(village);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteVillage = (village) => {
    setSelectedVillage(village);
    setIsDeleteModalOpen(true);
  };

  const handleDemographicsUpdate = (village) => {
    setSelectedVillage(village);
    setIsDemographicModalOpen(true);
  };
  const handleUpdateConfirm = () => {
    const updatedVillages = allVillages.map((village) =>
      village.id === selectedVillage.id ? selectedVillage : village
    );
    setAllVillages(updatedVillages);
    setFilteredVillages(updatedVillages);
    localStorage.setItem("villages", JSON.stringify(updatedVillages));
    setIsUpdateModalOpen(false);
    alert("Village updated successfully!");
  };
  const handleDeleteConfirm = () => {
    if (!selectedVillage) return; // Ensure a village is selected

    // Remove the village from the list
    const updatedVillages = allVillages.filter(
      (village) => village.id !== selectedVillage.id
    );

    // Update state and localStorage
    setAllVillages(updatedVillages);
    setFilteredVillages(updatedVillages);
    localStorage.setItem("villages", JSON.stringify(updatedVillages));

    // Close the modal
    setIsDeleteModalOpen(false);

    alert(`Village "${selectedVillage.name}" has been deleted successfully.`);
  };
  const handleSaveDemographic = () => {
    const updatedVillages = allVillages.map((village) =>
      village.id === selectedVillage.id ? selectedVillage : village
    );
    setAllVillages(updatedVillages);
    setFilteredVillages(updatedVillages);
    localStorage.setItem("villages", JSON.stringify(updatedVillages));
    setIsDemographicModalOpen(false);
    alert("Demographic data added successfully!");
  };
  

  return (
    <div className="flex w-full h-screen bg-gray-900 text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto ">
        <div className="flex justify-start">
          {userRole === "admin" && (
            <button
              className="bg-gray-400 text-white border-none py-2 px-4 rounded transition duration-300 hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Add New Village
            </button>
          )}
        </div>
        <div id="modal-container">
          {/* Add Village Modal */}
          {isModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
              <div className="bg-[#202c34] max-h-[calc(100%-2rem)] w-[35%] text-[#d1d5db] p-8 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[24px] font-bold">Add New Village</h2>
                  <button
                    className="text-[#d1d5db] text-2xl cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleAddVillage}>
                  <div className="mt-0">
                    <label
                      htmlFor="village-name"
                      className="block mb-0 text-sm"
                    >
                      Village Name:
                    </label>
                    <input
                      type="text"
                      id="village-name"
                      name="name"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      value={newVillage.name}
                      placeholder="Enter village name"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mt-0">
                    <label htmlFor="region" className="block mb-0 text-sm">
                      Region/District:
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      value={newVillage.region}
                      placeholder="Enter region or district"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mt-0">
                    <label htmlFor="land-area" className="block mb-0 text-sm">
                      Land Area (sq km):
                    </label>
                    <input
                      type="number"
                      id="land-area"
                      name="landArea"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      value={newVillage.landArea}
                      placeholder="Enter land area"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mt-0">
                    <label htmlFor="latitude" className="block mb-0 text-sm">
                      Latitude:
                    </label>
                    <input
                      type="text"
                      id="latitude"
                      name="latitude"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      value={newVillage.latitude}
                      placeholder="Enter latitude"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mt-0">
                    <label htmlFor="longitude" className="block mb-0 text-sm">
                      Longitude:
                    </label>
                    <input
                      type="text"
                      id="longitude"
                      name="longitude"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      value={newVillage.longitude}
                      placeholder="Enter longitude"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mt-0">
                    <label htmlFor="image" className="block mb-0 text-sm">
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mt-0">
                    <label htmlFor="tags" className="block mb-0 text-sm">
                      Categories/Tags:
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-[#d1d5db]"
                      value={newVillage.tags}
                      placeholder="e.g., rural, urban"
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-[2.5rem] text-sm bg-[#4a5568] text-[#d1d5db] rounded hover:bg-[#2b6cb0]"
                  >
                    Add Village
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* View Village Modal */}
          {isViewModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
              <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Village Details</h2>
                  <button
                    className="text-white text-2xl cursor-pointer"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {/* Village Basic Details */}
                  <p>
                    <strong>Village Name:</strong> {selectedVillage?.name || ""}
                  </p>
                  <p>
                    <strong>Region/District:</strong>{" "}
                    {selectedVillage?.region || ""}
                  </p>
                  <p>
                    <strong>Land Area (sq km):</strong>{" "}
                    {selectedVillage?.landArea || ""}
                  </p>
                  <p>
                    <strong>Latitude:</strong> {selectedVillage?.latitude || ""}
                  </p>
                  <p>
                    <strong>Longitude:</strong>{" "}
                    {selectedVillage?.longitude || ""}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {selectedVillage?.tags?.join(", ") || "No tags"}
                  </p>
                  <div>
                    <strong>Image:</strong>{" "}
                    <img
                      src={selectedVillage?.image || "#"}
                      alt="Village"
                      className="mt-2 max-w-full h-auto rounded"
                    />
                  </div>

                  {/* Demographic Data */}
                  <h3 className="text-md font-bold mt-4">Demographic Data</h3>
                  <p>
                    <strong>Population Size:</strong>{" "}
                    {selectedVillage?.demographics?.populationSize || ""}
                  </p>
                  <p>
                    <strong>Age Distribution:</strong>{" "}
                    {selectedVillage?.demographics?.ageDistribution || ""}
                  </p>
                  <p>
                    <strong>Gender Ratios:</strong>{" "}
                    {selectedVillage?.demographics?.genderRatios || ""}
                  </p>
                  <p>
                    <strong>Population Growth:</strong>{" "}
                    {selectedVillage?.demographics?.populationGrowth || ""}
                  </p>
                </div>
              </div>
            </div>
          )}
          {isUpdateModalOpen && selectedVillage && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50"
              id="update-village-modal"
            >
              <div className="bg-gray-800 text-white p-6 rounded-lg w-[35%] max-h-[calc(100%-2rem)]">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Update Village</h2>
                  <button
                    className="text-white text-2xl cursor-pointer"
                    id="close-update-modal"
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                {/* Modal Body */}
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateConfirm();
                  }}
                >
                  {/* Village Name */}
                  <div>
                    <label
                      htmlFor="update-village-name"
                      className="block text-sm"
                    >
                      Village Name:
                    </label>
                    <input
                      type="text"
                      id="update-village-name"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={selectedVillage.name || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Region/District */}
                  <div>
                    <label htmlFor="update-region" className="block text-sm">
                      Region/District:
                    </label>
                    <input
                      type="text"
                      id="update-region"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={selectedVillage.region || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          region: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Land Area */}
                  <div>
                    <label htmlFor="update-land-area" className="block text-sm">
                      Land Area (sq km):
                    </label>
                    <input
                      type="number"
                      id="update-land-area"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={selectedVillage.landArea || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          landArea: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label htmlFor="update-latitude" className="block text-sm">
                      Latitude:
                    </label>
                    <input
                      type="text"
                      id="update-latitude"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={selectedVillage.latitude || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          latitude: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label htmlFor="update-longitude" className="block text-sm">
                      Longitude:
                    </label>
                    <input
                      type="text"
                      id="update-longitude"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={selectedVillage.longitude || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          longitude: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="update-tags" className="block text-sm">
                      Categories/Tags:
                    </label>
                    <input
                      type="text"
                      id="update-tags"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={selectedVillage.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        })
                      }
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-[2.5rem] text-sm bg-[#4a5568] text-[#d1d5db] rounded hover:bg-[#2b6cb0]"
                  >
                    Update Village
                  </button>
                </form>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50"
              id="delete-confirmation-modal"
            >
              <div className="bg-gray-800 text-white p-6 rounded-lg w-[30%]">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Delete Village</h2>
                  <button
                    className="text-white text-2xl cursor-pointer"
                    id="close-delete-modal"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-4">
                  <p>
                    Are you sure you want to delete{" "}
                    <span id="delete-village-name">
                      {selectedVillage?.name}
                    </span>
                    ?
                  </p>
                  <p>This action cannot be undone.</p>

                  {/* Modal Actions */}
                  <div className="flex justify-end gap-4">
                    <button
                      className="w-[100px] h-[2.5rem] bg-gray-600 text-white rounded hover:bg-gray-700"
                      id="cancel-delete"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-[100px] h-[2.5rem] bg-red-600 text-white rounded hover:bg-red-700"
                      id="confirm-delete"
                      onClick={handleDeleteConfirm}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isDemographicModalOpen && selectedVillage && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50"
              id="demographic-modal"
            >
              <div className="bg-gray-800 text-white p-6 rounded-lg w-[35%] max-h-[calc(100%-2rem)]">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">
                    Add Demographic Data for{" "}
                    <span id="demographic-village-name">
                      {selectedVillage.name || ""}
                    </span>
                  </h2>
                  <button
                    className="text-white text-2xl cursor-pointer"
                    id="close-demographic-modal"
                    onClick={() => setIsDemographicModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-4">
                  {/* Population Size */}
                  <div>
                    <label htmlFor="population-size" className="block text-sm">
                      Population Size:
                    </label>
                    <input
                      type="number"
                      id="population-size"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      placeholder="Enter total population"
                      value={selectedVillage.demographics?.populationSize || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          demographics: {
                            ...selectedVillage.demographics,
                            populationSize: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  {/* Age Distribution */}
                  <div>
                    <label htmlFor="age-distribution" className="block text-sm">
                      Age Distribution:
                    </label>
                    <input
                      type="text"
                      id="age-distribution"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      placeholder="e.g., 0-14: 30%, 15-64: 60%, 65+: 10%"
                      value={
                        selectedVillage.demographics?.ageDistribution || ""
                      }
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          demographics: {
                            ...selectedVillage.demographics,
                            ageDistribution: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  {/* Gender Ratios */}
                  <div>
                    <label htmlFor="gender-ratios" className="block text-sm">
                      Gender Ratios:
                    </label>
                    <input
                      type="text"
                      id="gender-ratios"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      placeholder="e.g., Male: 51%, Female: 49%"
                      value={selectedVillage.demographics?.genderRatios || ""}
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          demographics: {
                            ...selectedVillage.demographics,
                            genderRatios: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  {/* Population Growth */}
                  <div>
                    <label
                      htmlFor="population-growth"
                      className="block text-sm"
                    >
                      Population Growth Rate:
                    </label>
                    <input
                      type="text"
                      id="population-growth"
                      className="w-full h-[2.5rem] p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      placeholder="Enter annual growth rate (%)"
                      value={
                        selectedVillage.demographics?.populationGrowth || ""
                      }
                      onChange={(e) =>
                        setSelectedVillage({
                          ...selectedVillage,
                          demographics: {
                            ...selectedVillage.demographics,
                            populationGrowth: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  {/* Save Button */}
                  <div className="modal-actions flex justify-end mt-6">
                    <button
                      className="w-full h-[2.5rem] text-sm bg-[#4a5568] text-[#d1d5db] rounded hover:bg-[#2b6cb0]"
                      id="save-demographic"
                      onClick={handleSaveDemographic}
                    >
                      Add Demographic Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-custom-box-color p-4 rounded mt-4">
          <h2 className="text-custom-font-size-24 mb-4 font-bold">
            View Village List
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search villages..."
              className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
              onChange={handleSearch}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-white">
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="p-2 border border-gray-400 rounded bg-gray-700 text-white"
                  onChange={handleSort}
                >
                  <option value="default">Default</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span>Page:</span>
                <button
                  className="bg-gray-700 text-white py-1 px-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  onClick={() => handlePagination("prev")}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  className="bg-gray-700 text-white py-1 px-2 rounded hover:bg-blue-600 disabled:opacity-50"
                  onClick={() => handlePagination("next")}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredVillages.length / villagesPerPage)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {getVillagesForCurrentPage().map((village) => (
              <div
                key={village.id}
                className="flex justify-between items-center bg-custom-box-color-light p-4 rounded"
              >
                <div className="text-white">{village.name}</div>
                <div className="flex space-x-2">
                  <button
                    className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                    onClick={() => handleViewVillage(village)}
                  >
                    View
                  </button>
                  {userRole === "admin" && (
                    <>
                      <button
                        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                        onClick={() => handleUpdateVillage(village)}
                      >
                        Update Village
                      </button>
                      <button
                        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                        onClick={() => handleDeleteVillage(village)}
                      >
                        Delete Village
                      </button>
                      <button
                        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                        onClick={() => handleDemographicsUpdate(village)}
                      >
                        Update Demographic Data
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Village;
