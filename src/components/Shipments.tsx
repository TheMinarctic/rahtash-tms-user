import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { useApi } from "@/contexts/ApiProvider";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "sonner";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Shipment {
    id: number;
    shipment_name: string;
    number_of_containers: number;
    contains_dangerous_goods: boolean;
    port_of_loading: string;
    port_of_discharge: string;
    place_of_delivery: string;
    bill_of_lading_document?: string;
}

const Shipments = () => {

    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newShipmentName, setNewShipmentName] = useState('');
    const [loadingPage, setLoadingPage] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const navigate = useNavigate();
    const api = useApi();

    // Fetch Shipments
    useEffect(() => {
        const fetchShipments = async () => {
            setLoadingPage(true);
            const response = await api.get(`/api/v1/shipments/shipments`);
            setLoadingPage(false);
            if (response.ok && response.body?.data) {
                setShipments(response.body.data);
            } else {
                toast.error("Failed to fetch shipments");
            }
        };
        fetchShipments();
    }, [api]);

    const handleDeleteClick = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedShipment) return;
        try {
            const response = await api.delete(`/api/v1/shipments/shipments/${selectedShipment.id}`);
            if (response.ok) {
                setShipments(prev => prev.filter(shipment => shipment.id !== selectedShipment.id));
              toast.success("Shipment successfully deleted");
            } else {
                toast.error("Error deleting shipment");
            }
        } catch (error) {
            toast.error("Error deleting shipment");
        } finally {
           
            setIsDeleteOpen(false); // Close the modal after the operation
            setSelectedShipment(null); // Reset selected shipment
        }
    };

    const handleAddSubmit = async () => {
        const body = { shipment_name: newShipmentName };
        try {
            const response = await api.post("/api/v1/shipments/shipments/", body);
            if (response.ok) {
                toast.success("New shipment added successfully");
                setShipments(prev => [...prev, response.body.data]);
                setIsModalOpen(false);
                navigate(`/shipments/${response.body.data.id}`);
                setNewShipmentName('');
            } else if (response.status === 400) {
                toast.error("Error creating shipment");
            } else {
                toast.error("Server error, please try again later");
            }
        } catch (err) {
            toast.error("Failed to create shipment");
        }
    };

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

    return (
        <>
      
                <div dir="ltr" className="mt-0 shadow-md p-5 px-7 rounded-lg">
                    <h1 className="text-2xl mb-8 mt-8 text-black font-bold">Shipments</h1>
                    <Toaster />
                    <div className="mb-6 flex flex-col-reverse md:flex-row gap-6 px-3 justify-between items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border border-gray-950 rounded-md text-gray-900 bg-gray-100"
                        />
                        <Button className="w-full md:w-1/4" size="lg" onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> New Shipment
                        </Button>
                    </div>



                    {/* Shipments List */}
                    <Table className="table">
                        <TableHeader>
                            <TableColumn className="text-black text-start bg-green-500">Shipment Name</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500">Port of Loading</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500 hidden xl:table-cell">Port of Discharge</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500 hidden xl:table-cell">Place of Delivery</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500">Operation</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {shipments.map((shipment) => (
                                <TableRow key={shipment.id} className="border-b text-white leading-loose">
                                    <TableCell className="text-sm text-[#3b5df6]">{shipment.shipment_name || " - "}</TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-black">{shipment.port_of_loading || " - "}</TableCell>
                                    <TableCell className="whitespace-nowrap hidden xl:table-cell text-black">{shipment.port_of_discharge || " - "}</TableCell>
                                    <TableCell className="whitespace-nowrap hidden xl:table-cell text-black">{shipment.place_of_delivery || " - "}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 p-2">
                                            <BiSolidEdit onClick={() => navigate(`/shipments/${shipment.id}`)} className="text-primary hover:text-white cursor-pointer text-3xl" />
                                            <MdDelete className="text-red-500 cursor-pointer text-3xl" onClick={() => handleDeleteClick(shipment)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>


                    {/* Add New Shipment Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4">+ Add new shipment</h2>
                                <Label htmlFor="shipment-name">Shipment Name</Label>
                                <input
                                    id="shipment-name"
                                    value={newShipmentName}
                                    onChange={(e) => setNewShipmentName(e.target.value)}
                                    className="w-full p-2 border rounded-md my-2"
                                    placeholder="Enter Shipment Name"
                                />
                                <div className="flex justify-end mt-4">
                                    <Button onClick={() => setIsModalOpen(false)} className="mr-2 bg-red-500 hover:bg-red-400">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddSubmit}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Delete Confirmation Modal */}
                    {isDeleteOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4">Delete Shipment</h2>
                                <p>Are you sure you want to delete this shipment?</p>
                                <div className="flex justify-end mt-4">
                                    <Button onClick={() => setIsDeleteOpen(false)} className="mr-2 bg-red-500 hover:bg-red-400">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleDeleteConfirm}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
        
        </>
    );
};

export default Shipments;