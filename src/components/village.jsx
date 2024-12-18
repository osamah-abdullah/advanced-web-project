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
        const storedVillages = JSON.parse(localStorage.getItem("villages") || "[]");
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
  return (
    <div className="flex w-full h-screen bg-gray-900 text-white">
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
              <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Add New Village</h2>
                  <button
                    className="text-white text-2xl cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                </div>
                <form className="mt-4 space-y-4" onSubmit={handleAddVillage}>
                  <div>
                    <label htmlFor="village-name" className="block mb-1">
                      Village Name:
                    </label>
                    <input
                      type="text"
                      id="village-name"
                      name="name"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={newVillage.name}
                      placeholder="Enter village name"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="region" className="block mb-1">
                      Region/District:
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={newVillage.region}
                      placeholder="Enter region or district"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="land-area" className="block mb-1">
                      Land Area (sq km):
                    </label>
                    <input
                      type="number"
                      id="land-area"
                      name="landArea"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={newVillage.landArea}
                      placeholder="Enter land area"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="latitude" className="block mb-1">
                      Latitude:
                    </label>
                    <input
                      type="text"
                      id="latitude"
                      name="latitude"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={newVillage.latitude}
                      placeholder="Enter latitude"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block mb-1">
                      Longitude:
                    </label>
                    <input
                      type="text"
                      id="longitude"
                      name="longitude"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={newVillage.longitude}
                      placeholder="Enter longitude"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="image" className="block mb-1">
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="tags" className="block mb-1">
                      Categories/Tags:
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      className="w-full p-2 border border-gray-400 rounded bg-gray-700 text-white"
                      value={newVillage.tags}
                      placeholder="e.g., rural, urban"
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800"
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
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="bg-custom-box-color p-4 rounded mt-4">
          <h2 className="text-xl mb-4">View Village List</h2>
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
                className="flex justify-between items-center bg-gray-700 p-4 rounded"
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
                        Update
                      </button>
                      <button
                        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                        onClick={() => handleDeleteVillage(village)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-gray-600 text-white py-1 px-2 rounded hover:bg-blue-600"
                        onClick={() => handleDemographicsUpdate(village)}
                      >
                        Demographics
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
