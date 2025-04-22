import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiProvider";
import { Plus, Save, ChevronDown, ChevronUp } from "lucide-react";
import { VscCloudDownload } from "react-icons/vsc";
import { FaRegEdit, FaTruck, FaShippingFast, FaClipboardList } from "react-icons/fa";
import { TiTrash } from "react-icons/ti";
import { GoContainer } from "react-icons/go";
import { MdDangerous } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Shipment({ id }) {
    const api = useApi();

    const [shipmentData, setShipmentData] = useState(null);
    const [loadingPage, setLoadingPage] = useState(false);
    const [error, setError] = useState(null);

    // State for editable fields
    const [billOfLadingNumber, setBillOfLadingNumber] = useState('');
    const [containsDangerousGoods, setContainsDangerousGoods] = useState(false);
    const [dateOfLoading, setDateOfLoading] = useState('');
    const [note, setNote] = useState('');

    // Port selection states
    const [portOfLoading, setPortOfLoading] = useState(null);
    const [portOfDischarge, setPortOfDischarge] = useState(null);
    const [placeOfDelivery, setPlaceOfDelivery] = useState(null);
    const [isPortModalOpen, setIsPortModalOpen] = useState(false);
    const [portType, setPortType] = useState(''); // 'loading', 'discharge', or 'delivery'
    const [ports, setPorts] = useState([]);
    const [portLoading, setPortLoading] = useState(false);

    // Container states
    const [containers, setContainers] = useState([]);
    const [isAddContainerModalOpen, setIsAddContainerModalOpen] = useState(false);
    const [isEditContainerModalOpen, setIsEditContainerModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [containerToDelete, setContainerToDelete] = useState(null);
    const [selectedContainer, setSelectedContainer] = useState(null);
    
    // New container form
    const [trackNumber, setTrackNumber] = useState('');
    const [containerSize, setContainerSize] = useState(20);
    const [containerOrder, setContainerOrder] = useState('');
    const [containerType, setContainerType] = useState('dry');

    // UI states
    const [expandedSections, setExpandedSections] = useState({
        shipmentDetails: true,
        containers: true,
        parties: true
    });

    const fetchShipment = async () => {
        setLoadingPage(true);
        try {
            const response = await api.get(`/en/api/v1/shipment/detail/${id}/`);
            if (response.ok && response.body?.data) {
                const data = response.body.data;
                setShipmentData(data);
                setBillOfLadingNumber(data.bill_of_lading_number_id || '');
                setContainsDangerousGoods(data.contains_dangerous_good || false);
                setDateOfLoading(data.date_of_loading || '');
                setNote(data.note || '');
                setPortOfLoading(data.port_loading);
                setPortOfDischarge(data.port_discharge);
                setPlaceOfDelivery(data.place_delivery);
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
            const response = await api.get(`/en/api/v1/shipment/container/list/?shipment=${id}`);
            if (response.ok && response.body?.data) {
                setContainers(response.body.data);
            } else {
                toast.error('Error fetching containers');
            }
        } catch (error) {
            toast.error('Failed to fetch containers');
        }
    };

    const fetchPorts = async () => {
        setPortLoading(true);
        try {
            const response = await api.get('/en/api/v1/shipment/port/list/');
            if (response.ok && response.body?.data) {
                setPorts(response.body.data);
            }
        } catch (error) {
            toast.error('Failed to fetch ports');
        } finally {
            setPortLoading(false);
        }
    };

    useEffect(() => {
        fetchShipment();
        fetchContainers();
    }, [id, api]);

    const handleEditSubmit = async () => {
        setLoadingPage(true);
        try {
            const formData = {
                bill_of_lading_number_id: billOfLadingNumber,
                contains_dangerous_good: containsDangerousGoods,
                date_of_loading: dateOfLoading,
                note: note,
                port_loading: portOfLoading?.id || null,
                port_discharge: portOfDischarge?.id || null,
                place_delivery: placeOfDelivery?.id || null
            };

            

            const response = await api.patch(`/en/api/v1/shipment/update/${id}/`, formData);
            if (response.ok) {
                toast.success("Shipment updated successfully");
                fetchShipment();
            } else {
                toast.error("Error updating shipment");
            }
        } catch (error) {
            toast.error("Failed to update shipment");
        } finally {
            setLoadingPage(false);
        }
    };

    const handleAddContainer = async () => {
        if (!trackNumber || !containerSize || !containerOrder || !containerType) {
            toast.error("Please fill all required fields");
            return;
        }
    
        try {
            
            const response = await api.post('/en/api/v1/shipment/container/create/', {
                track_number: trackNumber,
                size: containerSize, // Now an integer
                order: parseInt(containerOrder, 10),
                type: 1, // Make sure this matches your API's expected values
                status: 1,
                shipment: id
            });
    
            if (response.ok) {
                toast.success('Container added successfully');
                fetchContainers();
                setIsAddContainerModalOpen(false);
                // Reset form
                setTrackNumber('');
                setContainerSize(20); // Reset to default 20ft
                setContainerOrder('');
                setContainerType('dry');
            } else {
                toast.error('Error adding container');
            }
        } catch (error) {
            toast.error('Failed to add container');
            console.error('Error:', error);
        }
    };

    const handleEditContainer = async () => {
        if (!selectedContainer) return;

        try {
            debugger
            const response = await api.patch(
                `/en/api/v1/shipment/container/update/${selectedContainer.id}/`,
                {
                    track_number: selectedContainer.track_number,
                    size: selectedContainer.size,
                    order: selectedContainer.order,
                    
                }
            );

            if (response.ok) {
                toast.success('Container updated successfully');
                fetchContainers();
                setIsEditContainerModalOpen(false);
            } else {
                toast.error('Error updating container');
            }
        } catch (error) {
            toast.error('Failed to update container');
        }
    };

    const handleDeleteContainer = async () => {
        if (!containerToDelete) return;

        try {
            const response = await api.delete(
                `/en/api/v1/shipment/container/delete/${containerToDelete.id}/`
            );

            if (response.ok) {
                toast.success('Container deleted successfully');
                fetchContainers();
            } else {
                toast.error('Error deleting container');
            }
        } catch (error) {
            toast.error('Failed to delete container');
        } finally {
            setIsDeleteModalOpen(false);
            setContainerToDelete(null);
        }
    };

    const openPortModal = (type) => {
        setPortType(type);
        fetchPorts();
        setIsPortModalOpen(true);
    };

    const selectPort = (port) => {
        if (portType === 'loading') {
            setPortOfLoading(port);
        } else if (portType === 'discharge') {
            setPortOfDischarge(port);
        } else if (portType === 'delivery') {
            setPlaceOfDelivery(port);
        }
        setIsPortModalOpen(false);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (loadingPage && !shipmentData) {
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

    if (!shipmentData) {
        return <div className="text-black">Shipment not found</div>;
    }

    const getStatusBadge = (status) => {
        switch(status) {
            case 1: return <Badge variant="secondary">Pending</Badge>;
            case 2: return <Badge variant="default">Active</Badge>;
            case 3: return <Badge variant="destructive">Completed</Badge>;
            default: return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <div className="mt-5 flex flex-col -mr-3 md:mx-auto md:-mr-0">
            <Toaster />
            <div className="bg-white shadow-sm rounded-lg p-6 mx-auto w-full max-w-6xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Shipment Details</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        {getStatusBadge(shipmentData.status)}
                    </div>
                </div>

                {/* Shipment Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bill of Lading</CardTitle>
                            <FaClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipmentData.bill_of_lading_number_id || 'N/A'}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loading Date</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                                <path d="M12 3v6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Date(shipmentData.date_of_loading).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {new Date(shipmentData.date_of_loading).toLocaleTimeString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dangerous Goods</CardTitle>
                            <MdDangerous className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {shipmentData.contains_dangerous_good ? 'Yes' : 'No'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipment Details Section */}
                <Card className="mb-6">
                    <CardHeader 
                        className="flex flex-row items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('shipmentDetails')}
                    >
                        <CardTitle className="flex items-center gap-2">
                            <FaShippingFast className="h-5 w-5" />
                            <span>Shipment Details</span>
                        </CardTitle>
                        {expandedSections.shipmentDetails ? <ChevronUp /> : <ChevronDown />}
                    </CardHeader>
                    {expandedSections.shipmentDetails && (
                        <CardContent>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1">Bill of Lading Number:</label>
                                        <Input
                                            value={billOfLadingNumber}
                                            onChange={(e) => setBillOfLadingNumber(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1">Contains Dangerous Goods:</label>
                                        <select
                                            value={containsDangerousGoods ? 'true' : 'false'}
                                            onChange={(e) => setContainsDangerousGoods(e.target.value === 'true')}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1">Date of Loading:</label>
                                        <Input
                                            type="datetime-local"
                                            value={dateOfLoading}
                                            onChange={(e) => setDateOfLoading(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1">Port of Loading:</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={portOfLoading?.title || 'Not selected'}
                                                readOnly
                                                className="w-full"
                                            />
                                            <Button variant="outline" onClick={() => openPortModal('loading')}>
                                                Select
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1">Port of Discharge:</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={portOfDischarge?.title || 'Not selected'}
                                                readOnly
                                                className="w-full"
                                            />
                                            <Button variant="outline" onClick={() => openPortModal('discharge')}>
                                                Select
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 pb-1">Place of Delivery:</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={placeOfDelivery?.title || 'Not selected'}
                                                readOnly
                                                className="w-full"
                                            />
                                            <Button variant="outline" onClick={() => openPortModal('delivery')}>
                                                Select
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 pb-1">Note:</label>
                                <Input
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Parties Section */}
                <Card className="mb-6">
                    <CardHeader 
                        className="flex flex-row items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('parties')}
                    >
                        <CardTitle className="flex items-center gap-2">
                            <HiOutlineOfficeBuilding className="h-5 w-5" />
                            <span>Parties</span>
                        </CardTitle>
                        {expandedSections.parties ? <ChevronUp /> : <ChevronDown />}
                    </CardHeader>
                    {expandedSections.parties && (
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Carrier Company */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Carrier Company</h3>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={shipmentData.carrier_company?.logo} />
                                            <AvatarFallback>{shipmentData.carrier_company?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{shipmentData.carrier_company?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{shipmentData.carrier_company?.category?.title || ''}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Forwarding Company */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Forwarding Company</h3>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={shipmentData.forward_company?.logo} />
                                            <AvatarFallback>{shipmentData.forward_company?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{shipmentData.forward_company?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">{shipmentData.forward_company?.category?.title || ''}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Driver */}
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Driver</h3>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={shipmentData.driver?.image} />
                                            <AvatarFallback>{shipmentData.driver?.title?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{shipmentData.driver?.title || 'N/A'}</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`h-4 w-4 ${i < (shipmentData.driver?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step */}
                            <div className="mt-6 border rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Step</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                        <span className="font-medium">{shipmentData.step?.order || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{shipmentData.step?.title || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Containers Section */}
                <Card className="mb-6">
                    <CardHeader 
                        className="flex flex-row items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('containers')}
                    >
                        <CardTitle className="flex items-center gap-2">
                            <GoContainer className="h-5 w-5" />
                            <span>Containers ({containers.length})</span>
                        </CardTitle>
                        {expandedSections.containers ? <ChevronUp /> : <ChevronDown />}
                    </CardHeader>
                    {expandedSections.containers && (
                        <CardContent>
                            {containers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {containers.map(container => (
                                        <div key={container.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                        <GoContainer className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">#{container.track_number}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="outline">{container.size}</Badge>
                                                            <Badge variant="outline">{container.type}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedContainer(container);
                                                            setIsEditContainerModalOpen(true);
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Edit"
                                                    >
                                                        <FaRegEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setContainerToDelete(container);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete"
                                                    >
                                                        <TiTrash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm text-gray-500">Order: {container.order || 'N/A'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <GoContainer className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No containers</h3>
                                    <p className="mt-1 text-sm text-gray-500">Add containers to this shipment</p>
                                    <div className="mt-6">
                                        <Button onClick={() => setIsAddContainerModalOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" /> Add Container
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    )}
                    {containers.length > 0 && expandedSections.containers && (
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => setIsAddContainerModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Add Container
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Save Changes Button */}
                <div className="flex justify-end">
                    <Button
                        className="w-full md:w-auto"
                        size="lg"
                        onClick={handleEditSubmit}
                    >
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Port Selection Modal */}
            {isPortModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            Select {portType === 'loading' ? 'Port of Loading' : 
                                  portType === 'discharge' ? 'Port of Discharge' : 'Place of Delivery'}
                        </h2>
                        {portLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {ports.map(port => (
                                    <div 
                                        key={port.id} 
                                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => selectPort(port)}
                                    >
                                        <h3 className="font-medium">{port.title}</h3>
                                        <p className="text-sm text-gray-500">ID: {port.id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end mt-4">
                            <Button 
                                variant="outline"
                                onClick={() => setIsPortModalOpen(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Container Modal */}
            {isAddContainerModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Container</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 pb-1">Track Number:</label>
                                <Input
                                    value={trackNumber}
                                    onChange={(e) => setTrackNumber(e.target.value)}
                                    className="w-full"
                                    placeholder="Enter container number"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 pb-1">Size:</label>
                                    <select
    value={containerSize}
    onChange={(e) => setContainerSize(parseInt(e.target.value, 10))}
    className="w-full p-2 border rounded"
>
    <option value={20}>20ft</option>
    <option value={40}>40ft</option>
    <option value={45}>45ft</option>
</select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 pb-1">Type:</label>
                                    <select
                                        value={containerType}
                                        onChange={(e) => setContainerType(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="dry">Dry</option>
                                        <option value="reefer">Reefer</option>
                                        <option value="open-top">Open Top</option>
                                        <option value="flat-rack">Flat Rack</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 pb-1">Order:</label>
                                <Input
                                    type="number"
                                    value={containerOrder}
                                    onChange={(e) => setContainerOrder(e.target.value)}
                                    className="w-full"
                                    placeholder="Enter loading order"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsAddContainerModalOpen(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddContainer}>
                                Add Container
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Container Modal */}
            {isEditContainerModalOpen && selectedContainer && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Edit Container</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 pb-1">Track Number:</label>
                                <Input
                                    value={selectedContainer.track_number}
                                    onChange={(e) => setSelectedContainer({...selectedContainer, track_number: e.target.value})}
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 pb-1">Size:</label>
                                    <select
                                        value={selectedContainer.size}
                                        onChange={(e) => setSelectedContainer({...selectedContainer, size: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="20ft">20ft</option>
                                        <option value="40ft">40ft</option>
                                        <option value="45ft">45ft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 pb-1">Type:</label>
                                    <select
                                        value={selectedContainer.type}
                                        onChange={(e) => setSelectedContainer({...selectedContainer, type: e.target.value})}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="dry">Dry</option>
                                        <option value="reefer">Reefer</option>
                                        <option value="open-top">Open Top</option>
                                        <option value="flat-rack">Flat Rack</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 pb-1">Order:</label>
                                <Input
                                    type="number"
                                    value={selectedContainer.order}
                                    onChange={(e) => setSelectedContainer({...selectedContainer, order: e.target.value})}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditContainerModalOpen(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleEditContainer}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete container <span className="font-medium">#{containerToDelete?.track_number}</span>?</p>
                        <p className="text-sm text-gray-500">This action cannot be undone.</p>
                        <div className="flex justify-end mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive"
                                onClick={handleDeleteContainer}
                            >
                                Delete Container
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}