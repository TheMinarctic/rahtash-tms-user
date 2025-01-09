import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiProvider";
import { Plus, Save } from "lucide-react";
import { VscCloudDownload } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { TiTrash } from "react-icons/ti";
import { GoContainer } from "react-icons/go";

export default function Shipment({ id }) {
    const api = useApi();

    const [shipmentData, setShipmentData] = useState(null);
    const [loadingPage, setLoadingPage] = useState(false);
    const [error, setError] = useState(null);

    // State for editable fields
    const [shipmentName, setShipmentName] = useState('');
    const [ladingNumber, setLadingNumber] = useState('');
    const [numberOfContainers, setNumberOfContainers] = useState();
    const [portOfLoading, setPortOfLoading] = useState('');
    const [portOfDischarge, setPortOfDischarge] = useState('');
    const [deliveryPlace, setDeliveryPlace] = useState('');
    const [containsDangerousGoods, setContainsDangerousGoods] = useState(false);

    // States for file uploads
    const [msdsDocument, setMsdsDocument] = useState(null);
    const [msdsDocumentName, setMsdsDocumentName] = useState('');

    const [billOfLadingDocument, setBillOfLadingDocument] = useState(null);
    const [billOfLadingName, setBillOfLadingName] = useState('');

    const [packingList, setPackingList] = useState(null);
    const [packingListName, setPackingListName] = useState('');

    const [initialInvoice, setInitialInvoice] = useState(null);
    const [initialInvoiceName, setInitialInvoiceName] = useState('');

    const [finalInvoice, setFinalInvoice] = useState(null);
    const [finalInvoiceName, setFinalInvoiceName] = useState('');

    // Modal States for adding additional documents
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDocumentName, setNewDocumentName] = useState('');
    const [newDocumentFile, setNewDocumentFile] = useState(null);


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [containerToDelete, setContainerToDelete] = useState(null);

// Function to handle the delete request
const handleDeleteContainer = async () => {
    if (containerToDelete) {
        const response = await api.delete(`/api/v1/shipments/containers/${containerToDelete.id}/`);
        if (response.ok) {
            toast.success('Container deleted successfully');
            fetchContainers(); // Re-fetch containers to update the state
        } else {
            toast.error('Error deleting container');
        }
        setIsDeleteModalOpen(false);
        setContainerToDelete(null);
    }
};


    const [containers, setContainers] = useState([]);
const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);
const [newContainerNumber, setNewContainerNumber] = useState('');
const [containerSize, setContainerSize] = useState('20ft'); // Default value
const [customSize, setCustomSize] = useState('');
const [isEditContainerModalOpen, setIsEditContainerModalOpen] = useState(false);
const [selectedContainer, setSelectedContainer] = useState(null);

    const fetchShipment = async (url) => {
        setLoadingPage(true);
        try {
            const response = await api.get(url);
            if (response.ok) {
                setShipmentData(response.body.data);
                // Populate the editable fields with fetched data
                setShipmentName(response.body.data.shipment_name);
                setDeliveryPlace(response.body.data.place_of_delivery);
                setLadingNumber(response.body.data.bill_of_lading_number);
                setNumberOfContainers(response.body.data.number_of_containers);
                setPortOfLoading(response.body.data.port_of_loading);
                setPortOfDischarge(response.body.data.port_of_discharge);
                setContainsDangerousGoods(response.body.data.contains_dangerous_goods);
            } else {
                setError('Error fetching shipment data');
            }
        } catch (error) {
            setError("Failed to fetch shipment data");
        } finally {
            setLoadingPage(false);
        }
    };

    const fetchContainers = async () => {
        try {
            const response = await api.get('/api/v1/shipments/containers/');
            if (response.ok) {
                setContainers(response.body.data);
            } else {
                toast.error('Error fetching containers');
            }
        } catch (error) {
            toast.error('Failed to fetch containers');
        }
    };
    
    useEffect(() => {
        fetchShipment(`/api/v1/shipments/shipments/${id}`);
        fetchContainers();
    }, [id, api]);

    const handleAddContainerSubmit = async () => {
        const formData = {
            shipment: id,
            container_number: newContainerNumber,
            container_size: containerSize,
            custom_size: customSize
        };
    
        const response = await api.post('/api/v1/shipments/containers/', formData);
        if (response.ok) {
            toast.success('Container added successfully');
            fetchContainers(); // Re-fetch containers
        } else {
            toast.error('Error adding container');
        }
    
        setIsAddContainerModalOpen(false);
        clearAddContainerFields();
    };
    
    const clearAddContainerFields = () => {
        setNewContainerNumber('');
        setContainerSize('20ft');
        setCustomSize('');
    };


    const handleEditContainerSubmit = async () => {
        const formData = {
            container_number: selectedContainer.container_number,
            container_size: selectedContainer.container_size,
            custom_size: selectedContainer.custom_size
        };
    
        const response = await api.patch(`/api/v1/shipments/containers/${selectedContainer.id}/`, formData);
        if (response.ok) {
            toast.success('Container edited successfully');
            fetchContainers(); // Re-fetch containers
        } else {
            toast.error('Error editing container');
        }
    
        setIsEditContainerModalOpen(false);
        setSelectedContainer(null); // Reset selected container
    };

    const handleEditSubmit = async () => {
        setLoadingPage(true);

        // Ensure all fields are filled
        if (!shipmentName) {
            toast.error("Please fill the shipment name");
            setLoadingPage(false);
            return;
        }

        if (!numberOfContainers || isNaN(numberOfContainers) || Number(numberOfContainers) <= 0) {
            toast.error("Please enter a valid number for the number of containers");
            setLoadingPage(false);
            return;
        }

        const formData = new FormData();
        formData.append("shipment_name", shipmentName);
        formData.append("number_of_containers", numberOfContainers);
        formData.append("bill_of_lading_number", ladingNumber);
        formData.append("place_of_delivery", deliveryPlace);
        formData.append("port_of_loading", portOfLoading);
        formData.append("port_of_discharge", portOfDischarge);
        formData.append("contains_dangerous_goods", String(containsDangerousGoods));

        // Append documents if they have been uploaded
        if (msdsDocument) {
            formData.append("msds_document", msdsDocument);
        }
        if (billOfLadingDocument) {
            formData.append("bill_of_lading_document", billOfLadingDocument);
        }
        if (packingList) {
            formData.append("packing_list", packingList);
        }
        if (initialInvoice) {
            formData.append("initial_invoice", initialInvoice);
        }
        if (finalInvoice) {
            formData.append("final_invoice", finalInvoice);
        }

        const response = await api.patch(`/api/v1/shipments/shipments/${id}/`, formData);
        if (response.ok) {
            toast.success("Shipment edited successfully");
            fetchShipment(`/api/v1/shipments/shipments/${id}`); // Re-fetch data to update state
        } else {
            toast.error("Error editing shipment");
        }
    };

    const handleAddSubmit = async () => {
        if (!newDocumentName || !newDocumentFile) {
            toast.error("Please provide a name and a file for the additional document");
            return;
        }

        const formData = new FormData();
        formData.append("shipment", id); 
        formData.append("document_name", newDocumentName);
        formData.append("document_file", newDocumentFile);

        const response = await api.post(`/api/v1/shipments/additional-documents/`, formData);
        if (response.ok) {
            toast.success("Document added successfully");
            fetchShipment(`/api/v1/shipments/shipments/${id}`); // Re-fetch to update the additional documents
            setNewDocumentName(''); // Clear the input field
            setNewDocumentFile(null); // Clear the file
            setIsModalOpen(false); // Close the modal
        } else {
            toast.error("Error adding document");
        }
    };

    useEffect(() => {
        fetchShipment(`/api/v1/shipments/shipments/${id}`);
    }, [id, api]);

    if (loadingPage) {
        return (
            <div className="flex justify-center mt-[27%]">
                <div className="flex flex-row gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-black">{error}</div>;
    }

    return (

        <div className="mt-5 flex flex-col -mr-3 md:mx-auto md:-mr-0">
    <Toaster />
    {shipmentData ? (
        <div className="bg-dark-purple 2xl:w-5/6 p-6 mx-auto rounded-lg">
            <div className="flex flex-col">
                <div className="flex justify-center mt-1 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                        <h1 className="text-xl text-center text-black font-bold">Shipment Detail</h1>
                        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                    </div>
                </div>

                {/* Shipment Details */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Existing shipment input fields go here */}
                    <div>
                        <label className="block text-black pb-2">Shipment Name:</label>
                        <input
                            type="text"
                            value={shipmentName}
                            onChange={(e) => setShipmentName(e.target.value)}
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-black pb-2">Lading Number:</label>
                        <input
                            type="text"
                            value={ladingNumber}
                            onChange={(e) => setLadingNumber(e.target.value)}
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-black pb-2">Containers Number:</label>
                        <input
                            type="text"
                            value={numberOfContainers}
                            onChange={(e) => setNumberOfContainers(e.target.value)}
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-black pb-2">Loading Port:</label>
                        <input
                            type="text"
                            value={portOfLoading}
                            onChange={(e) => setPortOfLoading(e.target.value)}
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-black pb-2">Discharge Port:</label>
                        <input
                            type="text"
                            value={portOfDischarge}
                            onChange={(e) => setPortOfDischarge(e.target.value)}
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-black pb-2">Delivery Place:</label>
                        <input
                            type="text"
                            value={deliveryPlace}
                            onChange={(e) => setDeliveryPlace(e.target.value)}
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                    </div>
                </div>

                {/* Documents Section */}
                <div className="flex justify-center mt-10 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                        <h1 className="text-xl text-center text-black font-bold">Documents</h1>
                        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Existing document upload inputs go here */}
                    <div>
                        <label className="block text-black pb-2">Bill of Lading Document:</label>
                        <input
                            type="file"
                            onChange={(e) => {
                                setBillOfLadingDocument(e.target.files[0]);
                                setBillOfLadingName(e.target.files[0].name);
                            }}
                            accept=".pdf, .doc, .docx"
                            className="w-full p-2 bg-gray-400 rounded"
                        />
                        {billOfLadingName && (
                            <p className="text-primary flex gap-4 mt-2">
                                {billOfLadingName}
                                <a
                                    href={shipmentData.bill_of_lading_document}
                                    className="text-blue-400 underline"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <VscCloudDownload className="w-6 h-6 text-green-500" />
                                </a>
                            </p>
                        )}
                    </div>
                    {/* Additional document inputs can be added here... */}
                </div>

                {/* Container Management Section */}
                <div className="flex justify-center mt-10 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                        <h1 className="text-xl text-center text-black font-bold">Containers</h1>
                        <div className="w-20 md:w-64 h-[0.5px] bg-zinc-800"></div>
                    </div>
                </div>
                
                <div className="w-full md:w-10/12 mx-auto">
               
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                        {containers.map(container => (
                            <div key={container.id} className="flex  items-center gap-2">

                                <div className="flex gap-4 items-center ">
                                <GoContainer className="text-zinc-900 w-6 h-6" />
                              <div className="flex flex-col">

                              <span className="">number : {container.container_number}</span>
                              <span className="">size : {container.container_size !== 'custom' ? container.container_size : container.custom_size + 'ft' }</span>

                              </div>
                                
                                </div>

                               
                           <div className="flex items-center  ml-4 -mt-1 ">

                                
                           <button
                                    onClick={() => {
                                      setSelectedContainer(container);
                                      setIsEditContainerModalOpen(true);
                                    }} 
                                    className="text-blue-500 underline"
                                >
                                    <FaRegEdit className="w-6 h-6 text-green-500" />
                                </button>

                                    
                                <button
    onClick={() => {
        setContainerToDelete(container);
        setIsDeleteModalOpen(true);
    }} 
    className="text-blue-500 underline"
>
    <TiTrash className="w-7 h-7 text-red-500" />
</button>


                           </div>


                                
                            </div>
                        ))}
                        {containers.length === 0 && (
                            <p className="text-gray-400">No containers available</p>
                        )}
                    </div>

                    <div className="flex justify-between mb-4 mt-8">
                        <button onClick={() => setIsAddContainerModalOpen(true)} className="bg-zinc-900 text-white p-2 rounded">
                            + Add Container
                        </button>
                    </div>
                </div>

                {/* Add Container Modal */}
                {isAddContainerModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Add New Container</h2>
                            <label>Container Number</label>
                            <input
                                value={newContainerNumber}
                                onChange={(e) => setNewContainerNumber(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <label>Container Size</label>
                            <select
                                value={containerSize}
                                onChange={(e) => {
                                    setContainerSize(e.target.value);
                                    if(e.target.value !== "custom"){
                                        setCustomSize('');
                                    }
                                }}
                                className="w-full p-2 border rounded"
                            >
                                <option value="20ft">20ft</option>
                                <option value="40ft">40ft</option>
                                <option value="custom">Custom Size</option>
                            </select>
                            {containerSize === 'custom' && (
                                <input
                                    placeholder="Enter Custom Size"
                                    value={customSize}
                                    onChange={(e) => setCustomSize(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            )}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsAddContainerModalOpen(false)}
                                    className="mr-2 bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button onClick={handleAddContainerSubmit} className="bg-primary text-white p-2 rounded">
                                    Add Container
                                </button>
                            </div>
                        </div>
                    </div>
                )}


{isDeleteModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete container {containerToDelete.container_number}?</p>
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="mr-2 bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleDeleteContainer}
                    className="bg-primary text-white p-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
)}

                {/* Edit Container Modal */}
                {isEditContainerModalOpen && selectedContainer && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Edit Container</h2>
                            <label>Container Number</label>
                            <input
                                value={selectedContainer.container_number}
                                onChange={(e) => setSelectedContainer({ ...selectedContainer, container_number: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <label>Container Size</label>
                            <select
                                value={selectedContainer.container_size}
                                onChange={(e) => setSelectedContainer({ ...selectedContainer, container_size: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                <option value="20ft">20ft</option>
                                <option value="40ft">40ft</option>
                                <option value="custom">Custom Size</option>
                            </select>
                            {selectedContainer.container_size === 'custom' && (
                                <input
                                    placeholder="Enter Custom Size"
                                    value={selectedContainer.custom_size}
                                    onChange={(e) => setSelectedContainer({ ...selectedContainer, custom_size: e.target.value })}
                                    className="w-full p-2 border rounded mt-2"
                                />
                            )}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsEditContainerModalOpen(false)}
                                    className="mr-2 bg-red-500 hover:bg-red-400 text-white p-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button onClick={handleEditContainerSubmit} className="bg-primary text-white p-2 rounded">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Changes Button */}
                <div className="mt-10 w-full flex justify-center px-[5%]">
                    <Button
                        className="w-2/3 hover:bg-green-400 bg-green-500 text-white"
                        size="lg"
                        onClick={handleEditSubmit}
                    >
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    ) : (
        <h1 className="text-black">Something went wrong, please try again</h1>
    )}
</div>

    );
}