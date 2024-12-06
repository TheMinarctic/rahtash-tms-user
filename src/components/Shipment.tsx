import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiProvider";
import { Save } from "lucide-react";

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
    const [deliveryPlace, setDeliveryPlace] = useState(''); // Fixed typo on state name


    const fetchShipment = async (url) => {
        setLoadingPage(true);
        try {
            const response = await api.get(url);
            if (response.ok) {
                setShipmentData(response.body.data);
                // Populate the editable fields with fetched data
                setShipmentName(response.body.data.shipment_name);
                setDeliveryPlace(response.body.data.place_of_delivery); // Fixed typo
                setLadingNumber(response.body.data.bill_of_lading_number);
                setNumberOfContainers(response.body.data.number_of_containers);
                setPortOfLoading(response.body.data.port_of_loading);
                setPortOfDischarge(response.body.data.port_of_discharge);
            } else {
                setError('Error fetching shipment data');
            }
        } catch (error) {
            setError("Failed to fetch shipment data");
        } finally {
            setLoadingPage(false);
        }
    };

    const handleEditSubmit = async () => {
        setLoadingPage(true);

        // Ensure all fields are filled
        if (!shipmentName) {
            toast.error("Please fill the shipment name");
            setLoadingPage(false)
            return;
        }

        if (!numberOfContainers || isNaN(numberOfContainers) || Number(numberOfContainers) <= 0) {
            toast.error("Please enter a valid number for the number of containers");
            setLoadingPage(false)
            return;
        }

        const formData = new FormData();
        formData.append("shipment_name", shipmentName);
        formData.append("number_of_containers", numberOfContainers);
        formData.append("bill_of_lading_number", ladingNumber);
        formData.append("place_of_delivery", deliveryPlace); // Fixed typo
        formData.append("port_of_loading", portOfLoading);
        formData.append("port_of_discharge", portOfDischarge);
        
        const response = await api.patch(`/api/v1/shipments/${id}/`, formData);
        if (response.ok) {
            toast.success("Shipment edited successfully");
            fetchShipment(`/api/v1/shipments/${id}`); // Re-fetch data to update state
        } else {
            toast.error("Error editing shipment");
        }
    };

    useEffect(() => {
        fetchShipment(`/api/v1/shipments/${id}`);
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
        return <div className="text-white">{error}</div>;
    }

    return (
        <div className="mt-5 flex flex-col -mr-3 md:mx-auto md:-mr-0">
            <Toaster />
            {shipmentData ? (
                <div className="bg-dark-purple 2xl:w-5/6 p-6 mx-auto rounded-lg">
                    <div className="flex flex-col">
                        <div className="flex justify-center mt-10 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-20 md:w-64 :block h-[0.5px] bg-zinc-500"></div>
                                <h1 className="text-xl text-center text-white font-bold">Shipment Detail</h1>
                                <div className="w-20 md:w-64 lg:block h-[0.5px] bg-zinc-500"></div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-white pb-2">Shipment Name : </label>
                                <input
                                    type="text"
                                    value={shipmentName}
                                    onChange={(e) => setShipmentName(e.target.value)}
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-white pb-2">Lading Number :</label>
                                <input
                                    type="text"
                                    value={ladingNumber}
                                    onChange={(e) => setLadingNumber(e.target.value)} // Fixed value
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-white pb-2">Containers Number :</label>
                                <input
                                    type="text"
                                    value={numberOfContainers}
                                    onChange={(e) => setNumberOfContainers(e.target.value)}
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-white pb-2">Loading Port :</label>
                                <input
                                    type="text"
                                    value={portOfLoading}
                                    onChange={(e) => setPortOfLoading(e.target.value)}
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-white pb-2">Discharge Port :</label>
                                <input
                                    type="text"
                                    value={portOfDischarge}
                                    onChange={(e) => setPortOfDischarge(e.target.value)}
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-white pb-2">Delivery Place : </label>
                                <input
                                    type="text"
                                    value={deliveryPlace} // Fixed value
                                    onChange={(e) => setDeliveryPlace(e.target.value)}
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-white pb-2">Additional Documents :</label>
                                {shipmentData.additional_documents.length > 0 ? (
                                    shipmentData.additional_documents.map((doc, index) => (
                                        <a key={index} href={doc} className="block text-blue-500" target="_blank" rel="noreferrer">
                                            مشاهده مدرک {index + 1}
                                        </a>
                                    )
                               
                                )
                                
                                ) : (
                                    <span className="text-gray-400">Nothing Exist!!</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 w-full flex justify-center px-[5%]">
                        <Button className="w-2/3" size="lg" onClick={handleEditSubmit}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            ) : (
                <h1>Something went wrong, please try again</h1>
            )}
        </div>
    );
}