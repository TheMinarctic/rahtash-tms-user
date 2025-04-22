import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { useApi } from "@/contexts/ApiProvider";
import { MdDelete } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "sonner";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";

interface Shipment {
    id: number;
    bill_of_lading_number_id: string | null;
    contains_dangerous_good: boolean | null;
    port_loading: {
        id: number;
        title: string;
    } | null;
    port_discharge: {
        id: number;
        title: string;
    } | null;
    place_delivery: {
        id: number;
        title: string;
    } | null;
    status: number;
    date_of_loading: string | null;
    note: string | null;
}

interface ApiResponse {
    total_results: number;
    per_page: number;
    page_now: number;
    next_link: string | null;
    status: boolean;
    message: string;
    data: Shipment[];
}

const Shipments = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBillOfLadingNumber, setNewBillOfLadingNumber] = useState('');
    const [loadingPage, setLoadingPage] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const api = useApi();

    // Pagination state
    const [pagination, setPagination] = useState({
        totalResults: 0,
        perPage: 15,
        currentPage: 1,
        nextLink: null as string | null
    });

    // Fetch Shipments with pagination and search
    const fetchShipments = async (page: number = 1, search: string = '') => {
        setLoadingPage(true);
        try {
            let url = `/en/api/v1/shipment/list/?page=${page}`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }
            
            const response = await api.get(url);
            setLoadingPage(false);
            
            if (response.ok && response.body) {
                const data: ApiResponse = response.body;
                setShipments(data.data);
                setPagination({
                    totalResults: data.total_results,
                    perPage: data.per_page,
                    currentPage: data.page_now,
                    nextLink: data.next_link
                });
            } else {
                toast.error("Failed to fetch shipments");
            }
        } catch (error) {
            setLoadingPage(false);
            toast.error("Failed to fetch shipments");
        }
    };

    useEffect(() => {
        fetchShipments(1, searchQuery);
    }, [api, searchQuery]);

    const handleDeleteClick = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedShipment) return;
        try {
            const response = await api.delete(`/en/api/v1/shipment/delete/${selectedShipment.id}/`);
            if (response.ok) {
                setShipments(prev => prev.filter(shipment => shipment.id !== selectedShipment.id));
                toast.success("Shipment successfully deleted");
                // Refresh pagination counts
                setPagination(prev => ({
                    ...prev,
                    totalResults: prev.totalResults - 1
                }));
            } else {
                toast.error("Error deleting shipment");
            }
        } catch (error) {
            toast.error("Error deleting shipment");
        } finally {
            setIsDeleteOpen(false);
            setSelectedShipment(null);
        }
    };

    const handleAddSubmit = async () => {
        if (!newBillOfLadingNumber.trim()) {
            toast.error("Bill of Lading Number is required");
            return;
        }

        const body = { bill_of_lading_number_id: newBillOfLadingNumber };
        try {
            const response = await api.post("/en/api/v1/shipment/create/", body);
            if (response.ok && response.body) {
                toast.success("New shipment added successfully");
                // Add to beginning of list and handle pagination
                setShipments(prev => [response.body, ...prev].slice(0, pagination.perPage));
                setPagination(prev => ({
                    ...prev,
                    totalResults: prev.totalResults + 1
                }));
                setIsModalOpen(false);
                navigate(`/shipments/${response.body.id}`);
                setNewBillOfLadingNumber('');
            } else {
                toast.error(response.body?.message || "Error creating shipment");
            }
        } catch (err) {
            toast.error("Failed to create shipment");
        }
    };

    const handlePageChange = (page: number) => {
        fetchShipments(page, searchQuery);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Reset to first page when searching
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    if (loadingPage && shipments.length === 0) {
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
            <div dir="ltr" className="mt-0 shadow-md p-5 px-7 rounded-lg h-full flex flex-col">
                <h1 className="text-2xl mb-8 text-black font-bold">Shipments</h1>
                <Toaster />
                <div className="mb-6 flex flex-col-reverse md:flex-row gap-6 px-3 justify-between items-center">
                    <Input
                        type="text"
                        placeholder="Search shipments..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-2 border border-gray-950 rounded-md text-gray-900 bg-gray-100"
                    />
                    <Button className="w-full md:w-1/4" size="lg" onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> New Shipment
                    </Button>
                </div>

                {/* Shipments List with scrollable container */}
                <div className="flex-1 overflow-y-auto mb-4">
                    <Table 
                        className="table w-full"
                        aria-label="Shipments table"
                        isHeaderSticky
                    >
                        <TableHeader>
                            <TableColumn className="text-black text-start bg-green-500">Bill of Lading</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500">Port of Loading</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500 hidden xl:table-cell">Port of Discharge</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500 hidden lg:table-cell">Place of Delivery</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500">Status</TableColumn>
                            <TableColumn className="text-black text-start bg-green-500">Actions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {shipments.map((shipment) => (
                                <TableRow key={shipment.id} className="border-b text-white leading-loose">
                                    <TableCell className="text-sm text-[#3b5df6]">
                                        {shipment.bill_of_lading_number_id || "N/A"}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-black">
                                        {shipment.port_loading?.title || "N/A"}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap hidden xl:table-cell text-black">
                                        {shipment.port_discharge?.title || "N/A"}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap hidden lg:table-cell text-black">
                                        {shipment.place_delivery?.title || "N/A"}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-black">
                                        {shipment.status === 1 ? "Active" : 
                                         shipment.status === 2 ? "In Progress" : 
                                         shipment.status === 3 ? "Completed" : "Unknown"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 p-2">
                                            <BiSolidEdit 
                                                onClick={() => navigate(`/shipments/${shipment.id}`)} 
                                                className="text-primary hover:text-white cursor-pointer text-3xl" 
                                            />
                                            <MdDelete 
                                                className="text-red-500 cursor-pointer text-3xl" 
                                                onClick={() => handleDeleteClick(shipment)} 
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination - Always show if there are multiple pages */}
                {pagination.totalResults > pagination.perPage && (
                    <div className="flex justify-center mt-4 pb-4">
                        <Pagination
                            total={Math.ceil(pagination.totalResults / pagination.perPage)}
                            page={pagination.currentPage}
                            onChange={handlePageChange}
                            showControls
                            classNames={{
                                cursor: "bg-green-500 text-white"
                            }}
                        />
                    </div>
                )}

                {/* Add New Shipment Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
                            <h2 className="text-xl font-bold mb-4">+ Add new shipment</h2>
                            <Label htmlFor="bill-of-lading">Bill of Lading Number</Label>
                            <input
                                id="bill-of-lading"
                                value={newBillOfLadingNumber}
                                onChange={(e) => setNewBillOfLadingNumber(e.target.value)}
                                className="w-full p-2 border rounded-md my-2"
                                placeholder="Enter Bill of Lading Number"
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
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
                            <h2 className="text-xl font-bold mb-4">Delete Shipment</h2>
                            <p>Are you sure you want to delete shipment with Bill of Lading: <strong>{selectedShipment?.bill_of_lading_number_id || 'N/A'}</strong>?</p>
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