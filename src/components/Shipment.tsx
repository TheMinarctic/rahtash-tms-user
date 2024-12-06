import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiProvider";
import { Plus, Save } from "lucide-react";
import { VscCloudDownload } from "react-icons/vsc";

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

                // Set document names if they exist
                if (response.body.data.msds_document) {
                    setMsdsDocumentName(response.body.data.msds_document.split('/').pop());
                }
                if (response.body.data.bill_of_lading_document) {
                    setBillOfLadingName(response.body.data.bill_of_lading_document.split('/').pop());
                }
                if (response.body.data.packing_list) {
                    setPackingListName(response.body.data.packing_list.split('/').pop());
                }
                if (response.body.data.initial_invoice) {
                    setInitialInvoiceName(response.body.data.initial_invoice.split('/').pop());
                }
                if (response.body.data.final_invoice) {
                    setFinalInvoiceName(response.body.data.final_invoice.split('/').pop());
                }
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
        formData.append("place_of_delivery", deliveryPlace);
        formData.append("port_of_loading", portOfLoading);
        formData.append("port_of_discharge", portOfDischarge);
        formData.append("contains_dangerous_goods", String(containsDangerousGoods));

        // Append documents only if they have been uploaded
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
                        <div className="flex justify-center mt-1 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-500"></div>
                                <h1 className="text-xl text-center text-white font-bold">Shipment Detail</h1>
                                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-500"></div>
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
                                    onChange={(e) => setLadingNumber(e.target.value)}
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
                                    value={deliveryPlace}
                                    onChange={(e) => setDeliveryPlace(e.target.value)}
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                            </div>

                            </div>

                            <div className="flex justify-center mt-10 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-500"></div>
                                <h1 className="text-xl text-center text-white font-bold">Documents</h1>
                                <div className="w-20 md:w-64 h-[0.5px] bg-zinc-500"></div>
                            </div>
                        </div>

                            <div className="grid lg:grid-cols-2 gap-8">

                            {/* Bill of Lading Document */}
                            <div>
                                <label className="block text-white pb-2">Bill of Lading Document :</label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setBillOfLadingDocument(e.target.files[0]);
                                        setBillOfLadingName(e.target.files[0].name); // Set the file name
                                    }}
                                    accept=".pdf, .doc, .docx"
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                                {billOfLadingName && <p className="text-green-400 flex gap-4 mt-2">{billOfLadingName}  <a
                                    href={shipmentData.bill_of_lading_document}
                                    className=" text-blue-400 underline "
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <VscCloudDownload className="w-6 h-6" />
                                </a>
                                </p>

                                } {/* Show file name */}
                            </div>

                            {/* Packing List */}
                            <div>
                                <label className="block text-white pb-2">Packing List :</label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setPackingList(e.target.files[0]);
                                        setPackingListName(e.target.files[0].name); // Set the file name
                                    }}
                                    accept=".pdf, .doc, .docx"
                                    className="w-full p-2  bg-gray-300 rounded"
                                />
                                {packingListName && <p className="text-green-400 flex gap-4 mt-2 ">{packingListName}   <a
                                    href={shipmentData.packing_list}
                                    className=" text-blue-400 underline "
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <VscCloudDownload className="w-6 h-6" />
                                </a>
                                </p>

                                } {/* Show file name */}
                            </div>

                            {/* Initial Invoice */}
                            <div>
                                <label className="block text-white pb-2">Initial Invoice :</label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setInitialInvoice(e.target.files[0]);
                                        setInitialInvoiceName(e.target.files[0].name); // Set the file name
                                    }}
                                    accept=".pdf, .doc, .docx"
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                                {initialInvoiceName && <p className="text-green-400 flex gap-4 mt-2">{initialInvoiceName}

                                    <a
                                        href={shipmentData.initial_invoice}
                                        className=" text-blue-400 underline "
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <VscCloudDownload className="w-6 h-6" />
                                    </a>
                                </p>

                                } {/* Show file name */}
                            </div>

                            {/* Final Invoice */}
                            <div>
                                <label className="block text-white pb-2">Final Invoice :</label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setFinalInvoice(e.target.files[0]);
                                        setFinalInvoiceName(e.target.files[0].name); // Set the file name
                                    }}
                                    accept=".pdf, .doc, .docx"
                                    className="w-full p-2 bg-gray-300 rounded"
                                />
                                {finalInvoiceName && <p className="text-green-400 flex gap-4 mt-2"> {finalInvoiceName}

                                    <a
                                        href={shipmentData.final_invoice}
                                        className=" text-blue-400 underline "
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <VscCloudDownload className="w-6 h-6" />
                                    </a></p>} {/* Show file name */}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={containsDangerousGoods}
                                    onChange={(e) => {
                                        setContainsDangerousGoods(e.target.checked);
                                        // Reset the file names when the checkbox is unchecked
                                        if (!e.target.checked) {
                                            setMsdsDocument(null);
                                            setMsdsDocumentName(''); // Clear the MSDS file name
                                        }
                                    }}
                                    className="mr-2"
                                />
                                <label className="text-white">Contains Dangerous Goods</label>
                            </div>

                            {containsDangerousGoods && ( // Show MSDS file input only if checkbox is checked
                                <div>
                                    <label className="block text-white pb-2">MSDS Document :</label>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            setMsdsDocument(e.target.files[0]); // Set the uploaded file
                                            setMsdsDocumentName(e.target.files[0].name); // Set the file name
                                        }}
                                        accept=".pdf, .doc, .docx" // Accept only document files
                                        className="w-full p-2 bg-gray-300 rounded"
                                    />
                                    {msdsDocumentName && <p className="text-green-400 flex gap-4 mt-2">{msdsDocumentName}  <a
                                        href={shipmentData.msds_document}
                                        className=" text-blue-400 underline "
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <VscCloudDownload className="w-6 h-6" />
                                    </a>
                                    </p>

                                    } {/* Show file name */}
                                </div>
                            )}

                            {/* Additional Documents Section */}
                            <div>
                                <label className="block text-white pb-2">Additional Documents :</label>
                                {shipmentData.additional_documents.length > 0 ? (
                                    shipmentData.additional_documents.map((doc, index) => (
                                        <a key={index} href={doc} className="block text-blue-500" target="_blank" rel="noreferrer">
                                            مشاهده مدرک {index + 1}
                                        </a>
                                    ))
                                ) : (
                                    <span className="text-gray-400">Nothing Exist!!</span>
                                )}
                            </div>


                        </div>
                    </div>

                    <div className="mt-10 w-full flex justify-center px-[5%]">
                        <Button
                            className="w-2/3"
                            size="lg"
                            onClick={handleEditSubmit}
                        >
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>
            ) : (
                <h1 className="text-white">Something went wrong, please try again</h1>
            )
            }
        </div >
    );
}