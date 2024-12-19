import React, { useState } from "react";
import Sidebar from "./Sidebar";

const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageDescription, setImageDescription] = useState("");

  const handleAddImage = (e) => {
    e.preventDefault();

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem = {
          src: e.target.result,
          description: imageDescription,
        };
        setGalleryItems([...galleryItems, newItem]);
        setIsModalOpen(false);
        setImageFile(null);
        setImageDescription("");
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-[#1a1e23] text-white">
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4a5568] text-white px-6 py-2 rounded-md hover:bg-[#2d3748] transition-colors"
          >
            Add New Image
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {galleryItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-custom-box-color border border-[#2d3748] rounded-lg p-4 hover:border-[#4a5568] transition-colors flex flex-col items-center justify-center"
            >
              <img
                src={item.src}
                alt="Gallery"
                className="w-[150px] h-[150px] object-cover rounded-md mb-3 bg-[#2d3748]"
              />
              <p className="text-[#8b949e] text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="bg-[#1e2329] p-6 rounded-lg w-full max-w-md border border-[#2d3748]">
              <h2 className="text-lg font-semibold text-white mb-4 text-center">
                Add New Image
              </h2>
              <form onSubmit={handleAddImage} className="space-y-4">
                <div>
                  <label className="block mb-2 text-[#8b949e]">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-3 py-2 bg-[#2d3748] rounded-md border border-[#4a5568] text-white focus:outline-none focus:border-[#6b7280]"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#8b949e]">
                    Image Description
                  </label>
                  <input
                    type="text"
                    required
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    placeholder="Enter description"
                    className="w-full px-3 py-2 bg-[#2d3748] rounded-md border border-[#4a5568] text-white focus:outline-none focus:border-[#6b7280]"
                  />
                </div>
                <div className="flex justify-between space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-[#dc2626] px-4 py-2 rounded-md hover:bg-[#b91c1c] transition-colors text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#2563eb] px-4 py-2 rounded-md hover:bg-[#1d4ed8] transition-colors text-white"
                  >
                    Add Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
